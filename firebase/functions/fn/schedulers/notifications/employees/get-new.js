
const {send_new, resend} = require('./send.js');

exports.getSending = async (tbl, _group, collectionGroup, employeesByXOnly, name) => {
    const employeesByXOnlyNotifsSnapshots = await getNotificationsToSend(collectionGroup, employeesByXOnly, name);
    //send_new / resend
    const sendingList = await send_new(employeesByXOnlyNotifsSnapshots, tbl, _group, name);
    //sendingList = [{expiry_date__none, expiry_date__expired, expiry_date__future_expiry}]
    //expiry_date__none = [employee_item]
    //expiry_date__expired = [{employee_item, expiry_date}]
    //expiry_date__future_expiry = [{employee_item, expiry_date}]
    const resendingList = await resend(employeesByXOnlyNotifsSnapshots, tbl, _group, name);

    console.log('getSending', JSON.stringify(employeesByXOnlyNotifsSnapshots.map(v => v.resent_docs)), !!sendingList, !!resendingList)
    
    if (!sendingList && !resendingList) {
        return null;
    }
    return {sendingList, resendingList};
};

const getNotificationsToSend = async (collectionGroup, list, name) => {
    return Promise.all(list.map(async employee_item => {
        const {
            data: {
                user_id,
                fname, lname,
                client, project, site
            }
        } = employee_item;

        let q = db2.collection('default_notifications');
        q = q.where('_target.id', '==', employee_item.id).
                where('name.singular', '==', name.singular).
//                    where('email_sent', '==', true).
                where('removed', '==', false);

        const snapshot = await q.get();
        if (snapshot.empty) {
            const {id, expiry_date} = ((employee_item, collectionGroup) => {
                const list = employee_item.data[collectionGroup];
                const {latest: {id}, id: ids} = employee_item.data.docs[collectionGroup];
                const last = list[id];
                const {expiry_date} = last;
                return {id, expiry_date};
            })(employee_item, collectionGroup);

            return {employee_item, new : {id, expiry_date, name: {...name, id}}};
        } else {
            return {employee_item, resent_docs: snapshot.docs.filter(doc => !doc.get('email_sent'))};
        }
    }));
};
