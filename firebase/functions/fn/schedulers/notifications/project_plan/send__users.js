const {createNotif} = require('./create_notif');
const {send: send_expired} = require("./send_expired");
const {send: send_no_expiry} = require("./send_no_expiry");
const {send: send_to_expire} = require("./send_to_expire");

//<editor-fold desc="columns">
const columns = [
    {header: 'Ref. #', key: 'Ref. #', width: 10},

    {header: 'Company', key: 'Company', width: 30},
    {header: 'Project', key: 'Project', width: 30},
    {header: 'Site', key: 'Site', width: 30},

    {header: 'Responsible Person', key: 'Responsible Person', width: 25},
    {header: 'Approving Person', key: 'Approving Person', width: 25},

    {header: 'Source', key: 'Source', width: 25},
    {header: 'Type', key: 'Type', width: 25},
    {header: 'Priority', key: 'Priority', width: 25},
    {header: 'Process', key: 'Process', width: 15},
    {header: 'Description', key: 'Description', width: 15},
    {header: 'Comments', key: 'Comments', width: 25},
    {header: 'Remarks', key: 'Remarks', width: 25},
    {header: 'Additional Notes', key: 'Additional Notes', width: 25},

    {header: 'Acceptance Status', key: 'Acceptance Status', width: 20},
    {header: 'Status', key: 'Status', width: 10},
    {header: 'Result', key: 'Result', width: 10},
    {header: 'Due Date', key: 'Due Date', width: 15},
    {header: 'Days Left/Passed', key: 'Days Left/Passed', width: 15},
    {header: 'Progress Date', key: 'Progress Date', width: 15},
    {header: 'Completed Date', key: 'Completed Date', width: 15}
];
//</editor-fold>

//<editor-fold desc="send_users">
exports.send = async ({company_ids, company_groups}) => {
    // console.log('*********************************************')
    // console.log('send_users', collectionGroup)
    // console.log('*********************************************')

    const users_by_company_snapshots = await get_users_by_company_snapshots({company_ids,});

    for (let j = 0; j < users_by_company_snapshots.length; j++) {
        let {docs: user_docs} = users_by_company_snapshots[j];
        if (!user_docs.isEmpty()) {
            user_docs = user_docs.map(doc => ({id: doc.id, data: doc.data()}));
            // console.log('user_docs available', user_docs.length, user_docs.map(({data}) => data.username))

            user_docs = user_docs.filter(({id, data: {receive_modules_notifs}}) => {
                if (!receive_modules_notifs) {
                    return false;
                }
                return receive_modules_notifs.anyMatch(v => v.text === 'Receive Non-Conformance Management Notifications' && v.value);
            });
            // console.log('user_docs to send', user_docs.length, user_docs.map(({data}) => data.username))

            if (!user_docs.isEmpty()) {
                //each docs / company
                const firstUser = user_docs[0];
                const {company_id, username} = firstUser.data;
                if (company_id !== "qPFSzXKRmPBUwUztZ379") {
                    //qPFSzXKRmPBUwUztZ379 Me
                    //4hKU3CF7tder8OhqoGrf Gobonzela
                    //A3RpXSVOhVKnZmmjS0DJ SHEQ Solve
                    // return;
                }

                let sentList = company_groups[company_id];
                sentList = await get_sentList({sentList});

                // console.log('------send_users', user_docs.map(({data}) => data.username), company_id, sentList.length, "\n\n");

                const processes_users_with_sentList = await get_processes_users_with_sentList({user_docs, sentList});

                for (let n = 0; n < processes_users_with_sentList.length; n++) {
                    await send_final(processes_users_with_sentList[n]);
                }
            }
        }
    }
};
//</editor-fold>

//<editor-fold desc="send_final">
const send_final = async (
    {
        id,
        username,
        user_id,
        company_id,
        client,
        project,
        site,
        client_id,
        project_id,
        site_id,
        sentList
    }
) => {
    console.log('send_final', username)
    if (username === 'edward2@sheqsolve.com') {
        username = 'edward@sheqsolve.com';
    }
    username = 'kheelet@gmail.com';

    const sheets = [];

    const item = {
        id,
        username,
        user_id,
        company_id,
        client,
        project,
        site,
        client_id,
        project_id,
        site_id,
        sentList
    };

    await send_expired({sheets, columns, item,});
    await send_to_expire({sheets, columns, item,});
    await send_no_expiry({sheets, columns, item,});

    const folder = "Non-Conformance-Expiry";
    const fileName = ("NCR-" + id) + ".xlsx";
    const dataUri = await createExcelFileSheets({folder, fileName, sheets});
    // console.log("dataUri", !!dataUri)
};
//</editor-fold>

//<editor-fold desc="get_processes_users_with_sentList">
const get_processes_users_with_sentList = async ({user_docs, sentList}) => {
    return (await Promise.all(user_docs.map(async (
        {
            id, data: {username, user_id, client, project, site, client_id, project_id, site_id, company_id}
        }
    ) => {
        const promise = [];

        let res = {
            id,
            username,
            user_id,
            company_id,
            client,
            project,
            site,
            client_id,
            project_id,
            site_id,
        };

        {
            const _client_id = client && client.id || client_id;
            if (_client_id) {
                promise.push(db.collection('plugin_sheq_assist_clients').doc(_client_id).get().then(snapshot => {
                    // console.log('clients', snapshot.exists, snapshot.id)
                    return snapshot.exists ? {id: snapshot.id, data: snapshot.data()} : null;
                }).then(val => {
                    if (val) res.client = val;
                    return null;
                }));
            }
            const _project_id = project && project.id || project_id;
            if (_project_id) {
                promise.push(db.collection('plugin_sheq_assist_projects').doc(_project_id).get().then(snapshot => {
                    // console.log('projects', snapshot.exists, snapshot.id)
                    return snapshot.exists ? {id: snapshot.id, data: snapshot.data()} : null;
                }).then(val => {
                    if (val) res.project = val;
                    return null;
                }));
            }
            const _site_id = site && site.id || site_id;
            if (_site_id) {
                promise.push(db.collection('plugin_sheq_assist_sites').doc(_site_id).get().then(snapshot => {
                    // console.log('sites', snapshot.exists, snapshot.id)
                    return snapshot.exists ? {id: snapshot.id, data: snapshot.data()} : null;
                }).then(val => {
                    if (val) res.site = val;
                    return null;
                }));
            }
        }

        await Promise.all(promise);

        {
            let {
                id,
                username,
                user_id,
                company_id,
                client,
                project,
                site,
                client_id,
                project_id,
                site_id,
            } = res;

            if (!client && !client_id) {
                return {...res, sentList};
            }

            const filter = (key, obj, obj_id) => (
                {
                    data: {
                        [key]: o,
                        [key + '_id']: o_id,
                    }
                }
            ) => (o_id && obj_id === o_id) || (o && o.id === obj && obj.id);

            if (!project && !project_id) {
                return {
                    ...res,
                    client,
                    sentList: sentList.filter(filter('client', client, client_id))
                };
            }

            if (!site && !site_id) {
                return {
                    ...res,
                    client,
                    project,
                    sentList: sentList.filter(filter('project', project, project_id))
                };
            }

            return {
                ...res,
                client,
                project,
                site,
                sentList: sentList.filter(filter('site', site, site_id))
            };
        }
    }))).filter(({sentList}) => !sentList.isEmpty());
};
//</editor-fold>

//<editor-fold desc="get_sentList">
const get_sentList = async ({sentList}) => {
    return (await Promise.all(sentList.map(async (
        {
            id,
            data,
            data: {
                created_at,
                client, project, site, client_id, project_id, site_id,
                //1
                type, priority,
                source, selected_source_id, selected_source_ref, selected_source_item,
                //2
                desc, process,
                //3
                due_date, responsible_person, approving_person,
                //4
                document_list,
                //5
                comments, remarks,
                //6
                progress_list,
                //7
                status_acceptance, status, result, completed_date, additional_notes
            }
        }
    ) => {

        const get = async (person) => {
            if (person && person.id) {
                const snapshot = await db_hr.collection('employees').doc(person.id).get();
                // console.log("sentList---", data.due_date, Dates.formatDate(data.due_date))
                if (snapshot.exists) {
                    return {id: snapshot.id, data: snapshot.data()};
                } else {
                    // console.log("---errr", responsible_person.id, responsible_person.lname, responsible_person.fname)
                }
            }
        };
        if (responsible_person) {
            const res = await get(responsible_person);
            if (res) {
                data.responsible_person = res;
            }
        }
        if (approving_person) {
            const res = await get(approving_person);
            if (res) {
                data.approving_person = res;
            }
        }

        const promise = [];
        {
            const _client_id = client && client.id || client_id;
            if (_client_id) {
                promise.push(db.collection('plugin_sheq_assist_clients').doc(_client_id).get().then(snapshot => {
                    return snapshot.exists ? {id: snapshot.id, data: snapshot.data()} : null;
                }).then(val => {
                    // console.log('clients', val && val.id)
                    if (val) data.client = val;
                    return null;
                }));
            }
            const _project_id = project && project.id || project_id;
            if (_project_id) {
                promise.push(db.collection('plugin_sheq_assist_projects').doc(_project_id).get().then(snapshot => {
                    return snapshot.exists ? {id: snapshot.id, data: snapshot.data()} : null;
                }).then(val => {
                    // console.log('projects', val && val.id)
                    if (val) data.project = val;
                    return null;
                }));
            }
            const _site_id = site && site.id || site_id;
            if (_site_id) {
                promise.push(db.collection('plugin_sheq_assist_sites').doc(_site_id).get().then(snapshot => {
                    return snapshot.exists ? {id: snapshot.id, data: snapshot.data()} : null;
                }).then(val => {
                    // console.log('sites', val && val.id)
                    if (val) data.site = val;
                    return null;
                }));
            }
        }

        await Promise.all(promise);

        return {id, data};
    }))).filter(v => !!v);
};
//</editor-fold>

//<editor-fold desc="get_users_by_company_snapshots">
const get_users_by_company_snapshots = async ({company_ids, _group,}) => {
    const users_query = (company_id) => db.collection('default_users').where('company_id', '==', company_id).
        // where('removed', '==', false).
        orderBy('receive_modules_notifs');

    return await Promise.all(company_ids.map(async company_id => await users_query(company_id).get()));
};
//</editor-fold>