//* 8 * * *
exports.covidScreeningDailyCheck = functions.pubsub.schedule('every 30 minutes').timeZone('Africa/Johannesburg').onRun(async ctx => {
//    const now = admin.firestore.Timestamp.now();
//
//    const today = new Date();
//    today.setHours(0);
//    today.setMinutes(0);
//    today.setSeconds(0);
//
//    let screeningQ = db.collection('plugin_sheq_assist_COVID_Management_screening');
//    screeningQ = screeningQ.where('created_at', '<=', now).where('created_at', '>=', today).select('employee');
//    const snapshot = await screeningQ.get();
//    const screeningList = [];
//    snapshot.forEach(doc => {
//        screeningList.push(doc.data().employee.id);
//    });
//
//    let employeeQ = db.collection('plugin_sheq_assist_employees');
//    if (screeningList.length > 0) {
//        console.log('covidScreeningDailyCheck1', screeningList.length)
//        employeeQ = employeeQ.where(admin.firestore.FieldPath.documentId(), 'not-in', screeningList);
//    }
//    const employeeSnapshot = await employeeQ.get();
//    const employeeList = [];
//    employeeSnapshot.forEach(doc => {
//        employeeList.push(doc.data());
//    });
//    const employeeListGrouped = employeeList.groupBy("company_id");
//    await Promise.all(Object.keys(employeeListGrouped).map(async key => {
//        const list = employeeListGrouped[key];
//
//        let userNotifsQ = db.collection('default_users');
//        userNotifsQ = userNotifsQ.where('company_id', '==', key).where('receive_covid_screening_notifs', '==', true).select('username');
//        const userNotifsSnapshot = await userNotifsQ.get();
//        const userNotifList = [];
//        userNotifsSnapshot.forEach(doc => {
//            userNotifList.push(doc.data());
//        });
//
//        let employeeNotifsQ = db.collection('plugin_sheq_assist_employees');
//        employeeNotifsQ = employeeNotifsQ.where('company_id', '==', key).where('receive_covid_screening_notifs', '==', true).select('email');
//        const employeeNotifsSnapshot = await employeeNotifsQ.get();
//        const employeeNotifsList = [];
//        employeeNotifsSnapshot.forEach(doc => {
//            employeeNotifsList.push(doc.data());
//        });
//
//        const emails = [
//            ...userNotifList.map(val => val.username),
//            ...employeeNotifsList.filter(val => val.email).map(val => val.email)
//        ];
//
//        const opts = {
//            from: '"SHEQ Aid" <support@sheqsolve.com>',
//            bcc: emails.join(','),
//            subject: 'SHEQ Aid Daily COVID Screening Notifications',
//            html: '<h3><b>Dear SHEQ Aid User</b></h3>\n\
//                <p>The following employees did not capture their daily COVID Screening:</p>'
//        };
//        list.forEach(val => {
//            opts.html += '<p><b>' + val.lname + ' ' + val.lname + '</b>';
//            if (val.phone || val.email) {
//                opts.html += ' <i>(';
//                if (val.phone) {
//                    opts.html += val.phone;
//                }
//                if (val.email) {
//                    opts.html += (val.phone ? ', ' : '') + ' ' + val.email;
//                }
//                opts.html += ')</i>';
//            }
//            opts.html += '</p>';
//        });
//        opts.html += '<p>Kind Regards<br/>SHEQ Aid</p>';
//
//        await EmailUtils.send(opts);
//        if (employeeList.length > 0) {
//            console.log('covidScreeningDailyCheck mails sent', list.length)
//        }
//    }));
    return null;
});