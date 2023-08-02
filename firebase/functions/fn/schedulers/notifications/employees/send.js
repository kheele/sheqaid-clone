
const {createNotif} = require('../funs.js');

exports.send_new = async (notificationsSnapshots, tbl, _group, name) => {
    const res = {};

    const newList = notificationsSnapshots.filter(v => !!v.new);

    if (newList.isEmpty()) {
        return null;
    }

    //send_new & (no expiry date / with expiry date)

    {
        //send_new & no expiry date
        const list = await SendNoExpiry.create_and_get__employees(newList, tbl, _group, name);
        const notifMsg = `<b>${name.plural}</b> of the following employees do not have expiry date.<br />Please add the expiry dates of their <b>${name.plural}</b>`;
        res.expiry_date__none = {notifMsg, list};//list = [employee_item]
    }

    {
        const newListWithExpiryDate = newList.filter(({new : {expiry_date}}) => !!expiry_date);

        //send_new & with expiry date && (expired / to expiry)
        {
            //send_new & with expiry date && expired
            const list = await SendWithExpiryExpired.create_and_get__employees(newListWithExpiryDate, tbl, _group, name);
            const notifMsg = `<b>${name.plural}</b> of the following employees have expired.<br />`;
            res.expiry_date__expired = {notifMsg, list};//list = [{employee_item, expiry_date}]
        }

        {
            //send_new & with expiry date && to expiry
            const list = await SendWithExpiryNotExpired.create_and_get__employees(newListWithExpiryDate, tbl, _group, name);
            const notifMsg = `<b>${name.plural}</b> of the following employees will expire within a month.<br />`;
            res.expiry_date__future_expiry = {notifMsg, list};//list = [{employee_item, expiry_date}]
        }
    }

    return res;
};

exports.resend = async (notificationsSnapshots, tbl, _group, name) => {
    const res = {};
    
    const resendList = notificationsSnapshots.filter(v => !!v.resent_docs);

    if (resendList.isEmpty()) {
        return null;
    }

    //resend & (no expiry date / with expiry date)

    {
        //send_new & no expiry date
        const list = await SendNoExpiry.create_and_get__employees(resendList, tbl, _group, name);
        const notifMsg = `<b>${name.plural}</b> of the following employees do not have expiry date.<br />Please add the expiry dates of their <b>${name.plural}</b>`;
        res.expiry_date__none = {notifMsg, list};//list = [employee_item]
    }
    
    {
        const listWithExpiryDate = resendList.filter(({new : {expiry_date}}) => !!expiry_date);

        //send_new & with expiry date && (expired / to expiry)
        {
            //send_new & with expiry date && expired
            const list = await SendWithExpiryExpired.create_and_get__employees(listWithExpiryDate, tbl, _group, name);
            const notifMsg = `<b>${name.plural}</b> of the following employees have expired.<br />`;
            res.expiry_date__expired = {notifMsg, list};//list = [{employee_item, expiry_date}]
        }

        {
            //send_new & with expiry date && to expiry
            const list = await SendWithExpiryNotExpired.create_and_get__employees(listWithExpiryDate, tbl, _group, name);
            const notifMsg = `<b>${name.plural}</b> of the following employees will expire within a month.<br />`;
            res.expiry_date__future_expiry = {notifMsg, list};//list = [{employee_item, expiry_date}]
        }
    }

    const list = await Promise.all(resendList.map(async ({employee_item, resent_docs}) => {
        const {
            data: {
                user_id,
                removed,
                company_id, client_id, project_id, site_id, client, project, site,
                fname, lname, id_num, passport_num, profile_pic,
                optional_info = {}, sub_collection_keys
            }
        } = employee_item;

        //re-send unsent/failed emails
//      console.log('sendExpiryEmails resend', snapshot.docs.map(v => v.data().email_sent))
        await Promise.all(resent_docs.map(async doc => {
            const {name, _target, _target: {desc: notifMsg}} = doc.data();
//                    
//          const expired = expiry_date < new Date().getTime();
//          const notifMsg = `<b>${name.singular}</b> of <b>${lname} ${fname}</b> ${expired ? 'expired' : 'will expire'} on <b>${Dates.formatDate(expiry_date)}</b>`;
//          snapshot = await createNotif(employee_item, tbl, _group, name, notifMsg);

//          return await sendEmail(snapshot, company_id, client, project, site);
        }));

        const {supervisor_name, supervisor_email, employee_num, department, job_position} = optional_info;

        return {
            employee_item: {
                id: employee_item.id,
                removed,
                company_id, client_id, project_id, site_id, client, project, site,
                fname, lname, id_num, passport_num, profile_pic,
                optional_info: {
                    supervisor_name, supervisor_email, employee_num, department, job_position
                },
                sub_collection_keys
            }
        };
    }));
    const notifMsg = `<b>${name.plural}</b> of the following employees will expire within a month.<br />`;

    return res;
};

const sendEmail = async (snapshot, company_id, client, project, site) => {
    let qUsers = db.collection('default_users');
    qUsers = qUsers.where('company_id', '==', company_id).where('receive_expired_docs_notifs', '==', true);
    if (client) {
        qUsers = qUsers.where('client_id', 'in', [null, client.id]);
    }
    const snapshot_users = await qUsers.get();
    const emails = snapshot_users.docs.
            map(doc => doc.data()).
            filter(({client: _client, client_id: _client_id}) => {
                if (!_client || !_client_id) {
                    return true;
                }
                if (client) {
                    if (_client) {
                        return client.id === _client.id;
                    } else {
                        return client.id === _client_id;
                    }
                }
                return false;
            }).
            filter(({project: _project, project_id: _project_id}) => {
                if (!_project || !_project_id) {
                    return true;
                }
                if (project) {
                    if (_project) {
                        return project.id === _project.id;
                    } else {
                        return project.id === _project_id;
                    }
                }
                return false;
            }).
            filter(({site: _site, site_id: _site_id}) => {
                if (!_site || !_site_id) {
                    return true;
                }
                if (site) {
                    if (_site) {
                        return site.id === _site.id;
                    } else {
                        return site.id === _site_id;
                    }
                }
                return false;
            }).
            map(data => data.username);

    console.log('sendEmail', emails, )
    if (!emails.isEmpty()) {
        const {name, _target, _target: {desc: notifMsg}} = snapshot.data();
//                    console.log('sendEmail', notifMsg)

        const opts = {
            from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
            bcc: emails.join(','),
            subject: 'SHEQ Aid Notifications',
            html: `<h3><b>Dear SHEQ Aid User</b></h3>\n
                            <p>SHEQ Aid would like to notify you of the following:</p>\n
                            ${notifMsg}\n
                            <p>Kind Regards<br/>SHEQ Aid</p>`
        };
        //TODO: send them well to avoid blocking
//                    await EmailUtils.send(opts);
//                    await snapshot.ref.set({email_sent: true}, {merge: true});
    }
};

class SendNoExpiry {
    static async create_and_get__employees(newList, tbl, _group, name) {
        const newListNoExpiryDate = newList.filter(({new : {expiry_date}}) => !expiry_date);
        return await Promise.all(newListNoExpiryDate.map(async ({employee_item}) => {
            const {
                data: {
                    user_id,
                    removed,
                    company_id, client_id, project_id, site_id, client, project, site,
                    fname, lname, id_num, passport_num, profile_pic,
                    optional_info = {}, sub_collection_keys
                }
            } = employee_item;
            const notifMsg = `<b>${name.singular}</b> of <b>${lname} ${fname}</b> does not have expiry date.<br />Please add the expiry date on this <b>${name.singular}</b>`;
//            const snapshot = await createNotif(employee_item, tbl, _group, name, notifMsg);
            console.log('sendExpiryEmails no expiry date', notifMsg)

//                                    await sendEmail(snapshot, company_id, client, project, site);

            const {supervisor_name, supervisor_email, employee_num, department, job_position} = optional_info;
            return {
                id: employee_item.id,
                removed,
                company_id, client_id, project_id, site_id, client, project, site,
                fname, lname, id_num, passport_num, profile_pic,
                optional_info: {
                    supervisor_name, supervisor_email, employee_num, department, job_position
                },
                sub_collection_keys
            };
        }));
    }
}

class SendWithExpiryExpired {
    static async create_and_get__employees(newListWithExpiryDate, tbl, _group, name) {
        const newListWithExpiryDateExpired = newListWithExpiryDate.filter(({new : {expiry_date}}) => {
            const expired = expiry_date < new Date().getTime();
            return expired;
        });
        return await Promise.all(newListWithExpiryDateExpired.map(async ({employee_item, new : {id, expiry_date}}) => {
            const {
                data: {
                    user_id,
                    removed,
                    company_id, client_id, project_id, site_id, client, project, site,
                    fname, lname, id_num, passport_num, profile_pic,
                    optional_info = {}, sub_collection_keys
                }
            } = employee_item;
            const notifMsg = `<b>${name.singular}</b> of <b>${lname} ${fname}</b> expired on <b>${Dates.formatDate(expiry_date)}</b>`;
//            const snapshot = await createNotif(employee_item, tbl, _group, name, notifMsg);

//                                    await sendEmail(snapshot, company_id, client, project, site);

            const {supervisor_name, supervisor_email, employee_num, department, job_position} = optional_info;
            return {
                employee_item: {
                    id: employee_item.id,
                    removed,
                    company_id, client_id, project_id, site_id, client, project, site,
                    fname, lname, id_num, passport_num, profile_pic,
                    optional_info: {
                        supervisor_name, supervisor_email, employee_num, department, job_position
                    },
                    sub_collection_keys
                },
                expiry_date: Dates.formatDate(expiry_date)
            };
        }));
    }
}

class SendWithExpiryNotExpired {
    static async create_and_get__employees(newListWithExpiryDate, tbl, _group, name) {
        const newListWithExpiryDateNotExpired = newListWithExpiryDate.filter(({new : {expiry_date}}) => {
            const expired = expiry_date < new Date().getTime();
            return !expired;
        });
        return await Promise.all(newListWithExpiryDateNotExpired.map(async ({employee_item, new : {id, expiry_date}}) => {
            const {
                data: {
                    user_id,
                    removed,
                    company_id, client_id, project_id, site_id, client, project, site,
                    fname, lname, id_num, passport_num, profile_pic,
                    optional_info = {}, sub_collection_keys
                }
            } = employee_item;
            const notifMsg = `<b>${name.singular}</b> of <b>${lname} ${fname}</b> will expire on <b>${Dates.formatDate(expiry_date)}</b>`;
//            const snapshot = await createNotif(employee_item, tbl, _group, name, notifMsg);

//                                    await sendEmail(snapshot, company_id, client, project, site);

            const {supervisor_name, supervisor_email, employee_num, department, job_position} = optional_info;
            return {
                employee_item: {
                    id: employee_item.id,
                    removed,
                    company_id, client_id, project_id, site_id, client, project, site,
                    fname, lname, id_num, passport_num, profile_pic,
                    optional_info: {
                        supervisor_name, supervisor_email, employee_num, department, job_position
                    },
                    sub_collection_keys
                },
                expiry_date: Dates.formatDate(expiry_date)
            };
        }));
    }
}