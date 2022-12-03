
const {send_new, resend} = require('./send.js');

const getClientUserDocs = (company_user_docs, client_id) => {
    if (client_id) {
        return company_user_docs.filter(({client: _client, client_id: _client_id}) => {
            if (!_client && !_client_id) {
                return true;
            }
            if (_client) {
                return client_id === _client.id;
            } else {
                return client_id === _client_id;
        }
        });
//        return company_qUsers.where('client_id', 'in', [null, client_id]);
    }
    return company_user_docs;
};

const getProjectUserDocs = (client_user_docs, project_id) => {
    if (project_id) {
        return client_user_docs.filter(({project: _project, project_id: _project_id}) => {
            if (!_project && !_project_id) {
                return true;
            }
            if (_project) {
                return project_id === _project.id;
            } else {
                return project_id === _project_id;
        }
        });
        //where('project_id', 'in', [null, project_id]);
    }
    return client_user_docs;
};

const getSiteUserDocs = (project_user_docs, site_id) => {
    if (site_id) {
        return project_user_docs.filter(({site: _site, site_id: _site_id}) => {
            if (!_site && !_site_id) {
                return true;
            }
            if (_site) {
                return site_id === _site.id;
            } else {
                return site_id === _site_id;
        }
        });
        //.where('site_id', 'in', [null, site_id]);
    }
    return project_user_docs;
};

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

//
exports.getEmployeesByCompanyAll = getEmployeesByCompanyAll = (client_list) => {
    return client_list.map(({client_id, project_list}) => {
        return project_list.map(({project_id, site_list}) => {
            return site_list.map(({site_id, list}) => list).reduce((a1, a2) => [...a1, ...a2], []);
        }).reduce((a1, a2) => [...a1, ...a2], []);
    }).reduce((a1, a2) => [...a1, ...a2], []);
};

exports.getEmployeesByCompanyOnly = (client_list) => {
    const employeesByCompany = getEmployeesByCompanyAll(client_list);
    return employeesByCompany.filter(({id, data: {fname, lname, company_id, client_id, project_id, site_id, client, project, site}}) => {
        return (!client_id && (!client || client === 'All')) &&
                (!project_id && (!project || project === 'All')) &&
                (!site_id && (!site || site === 'All'));
    });
};

exports.getEmployeesByClientOnly = (client_list) => {
    const employeesByCompany = getEmployeesByCompanyAll(client_list);
    return employeesByCompany.filter(({id, data: {fname, lname, company_id, client_id, project_id, site_id, client, project, site}}) => {
        return (client_id || (client && client !== 'All')) &&
                (!project_id && (!project || project === 'All')) &&
                (!site_id && (!site || site === 'All'));
    });
};

exports.getEmployeesByProjectOnly = (client_list) => {
    const employeesByCompany = getEmployeesByCompanyAll(client_list);
    return employeesByCompany.filter(({id, data: {fname, lname, company_id, client_id, project_id, site_id, client, project, site}}) => {
        return (client_id || (client && client !== 'All')) &&
                (project_id || (project && project !== 'All')) &&
                (!site_id && (!site || site === 'All'));
    });
};

exports.getEmployeesBySiteOnly = (client_list) => {
    const employeesByCompany = getEmployeesByCompanyAll(client_list);
    return employeesByCompany.filter(({id, data: {fname, lname, company_id, client_id, project_id, site_id, client, project, site}}) => {
        return (client_id || (client && client !== 'All')) &&
                (project_id || (project && project !== 'All')) &&
                (site_id || (site && site !== 'All'));
    });
};

//
exports.getUsersByCompanyAll = async (company_id, client_list) => {
    const company_qUsers = db.collection('default_users')
            .where('company_id', '==', company_id)
            .where('receive_expired_docs_notifs', '==', true);
    const snapshot_users = await company_qUsers.get();
    const {docs: company_user_docs} = snapshot_users;

    return client_list.map(({client_id, project_list}) => {
        const client_user_docs = getClientUserDocs(company_user_docs, client_id);

        return project_list.map(({project_id, site_list}) => {
            const project_user_docs = getProjectUserDocs(client_user_docs, project_id);

            return site_list.map(({site_id, list}) => {
                const site_user_docs = getSiteUserDocs(project_user_docs, site_id);

                return site_user_docs.map(doc => {
                    const {
                        company_id, client_id, project_id, site_id, client, project, site,
                        fname, lname, phone, username,
                        receive_expired_docs_notifs
                    } = doc.data();

                    return {
                        id: doc.id,
                        data: {
                            company_id, client_id, project_id, site_id, client, project, site,
                            fname, lname, username,
                            receive_expired_docs_notifs
                        }
                    };
                });
            }).reduce((a1, a2) => [...a1, ...a2], []);
        }).reduce((a1, a2) => [...a1, ...a2], []);
    }).reduce((a1, a2) => [...a1, ...a2], []).distinct('id');
};

exports.getUsersByCompanyOnly = (allUsersByCompany) => {
    return allUsersByCompany.filter(({id, data: {fname, lname, company_id, client_id, project_id, site_id, client, project, site}}) => {
        return (!client_id && (!client || client === 'All')) &&
                (!project_id && (!project || project === 'All')) &&
                (!site_id && (!site || site === 'All'));
    });
};

exports.getUsersByClientOnly = (allUsersByCompany) => {
    return allUsersByCompany.filter(({id, data: {fname, lname, company_id, client_id, project_id, site_id, client, project, site}}) => {
        return (client_id || (client && client !== 'All')) &&
                (!project_id && (!project || project === 'All')) &&
                (!site_id && (!site || site === 'All'));
    });
};

exports.getUsersByProjectOnly = (allUsersByCompany) => {
    return allUsersByCompany.filter(({id, data: {fname, lname, company_id, client_id, project_id, site_id, client, project, site}}) => {
        return (client_id || (client && client !== 'All')) &&
                (project_id || (project && project !== 'All')) &&
                (!site_id && (!site || site === 'All'));
    });
};

exports.getUsersBySiteOnly = (allUsersByCompany) => {
    return allUsersByCompany.filter(({id, data: {fname, lname, company_id, client_id, project_id, site_id, client, project, site}}) => {
        return (client_id || (client && client !== 'All')) &&
                (project_id || (project && project !== 'All')) &&
                (site_id || (site && site !== 'All'));
    });
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
