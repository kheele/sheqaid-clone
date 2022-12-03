//{employee_docs}
const employees = require('./employees/index.js');
const ncr = require('./ncr/index.js');

exports.sendExpiryEmailsTest = functions.https.onCall((data, ctx) => {
    employees.sendExpiryEmails(ctx);
    // console.log("sendExpiryEmailsTest");
    return 1;
});

// exports.sendEmail = functions.pubsub.schedule('0 7 * * 1-6').timeZone('Africa/Johannesburg').onRun(async ctx => {
// exports.taskRunner = functions.pubsub.schedule('* 8 * * *').timeZone('Africa/Johannesburg').onRun(async ctx => {
exports.taskRunner = functions.pubsub.schedule('every 3 minutes').timeZone('Africa/Johannesburg').onRun(async ctx => {
    // employees.sendExpiryEmails(ctx);
    // return;
    
    const now = admin.firestore.Timestamp.now();

    let q = db2.collection('default_tasks');//{id, data: {_group, name:{singular,plural}, tbl, id, status}}
    q = q.where('performedAt', '<=', now).where('status', '==', 'Schedule');
    const snapshot = await q.get();
    const tasks = [];
    snapshot.forEach(doc => {
        tasks.push(doc);
    });

    return await Promise.all(tasks.map(async doc => {
        const {group_key, status} = doc.data();
        const group = workers[group_key];
        if (group) {
            const worker = group[doc.id];
            if (worker) {
                return await worker(ctx).then(() => {
                    const later = admin.firestore.Timestamp.fromMillis(now.toMillis() + 5000);
                    return doc.ref.update({performedAt: later});
                }).catch(e => {
                    return doc.ref.update({status: "Error"});
                });
            } else {
                return await doc.ref.update({status: "UndefinedWorker"});
            }
        } else {
            return await doc.ref.update({status: "UndefinedGroup"});
        }
    }));
});

//exports.taskRunnerRetry = functions.pubsub.schedule('every 10 minutes').timeZone('Africa/Johannesburg').onRun(async ctx => {
exports.taskRunnerRetry = functions.pubsub.schedule('every 5 minutes').timeZone('Africa/Johannesburg').onRun(async ctx => {
    const now = admin.firestore.Timestamp.now();

    let q = db2.collection('default_tasks');//{id, data: {_group, name:{singular,plural}, tbl, id, status}}
    q = q.where('status', '==', 'Error');
    const snapshot = await q.get();
    const tasks = [];
    snapshot.forEach(doc => {
        tasks.push(doc);
    });

    if (tasks.length > 0)
    return await Promise.all(tasks.map(async doc => {
        const {group_key, status} = doc.data();
        const group = workers[group_key];
        if (group) {
            const worker = group[doc.id];
            if (worker) {
                return await worker(ctx).then(() => {
                    const later = admin.firestore.Timestamp.fromMillis(now.toMillis() + 5000);
                    return doc.ref.update({status: "Schedule", performedAt: later});
                }).catch(e => {
                    console.log(e)
                    return doc.ref.update({status: "Error"});
                });
            } else {
                return await doc.ref.update({status: "UndefinedWorker"});
            }
        } else {
            return await doc.ref.update({status: "UndefinedGroup"});
        }
    }));
});

const workers = {
    employees,
    ncr,
    COVID_Management: {

    },
    _01_Project_Plan: {

    },
    _02_IMS_Policies: {

    }
};