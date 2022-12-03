const {createNotif} = require('./employee_docs_create_notif');
const {send: send_expired} = require("./employee_docs-send_expired");
const {send: send_no_expiry} = require("./employee_docs-send_no_expiry");
const {send: send_to_expire} = require("./employee_docs-send_to_expire");

//<editor-fold desc="columns">
const columns = [
    {header: 'Company', key: 'Company', width: 30},
    {header: 'Project', key: 'Project', width: 30},
    {header: 'Site', key: 'Site', width: 30},

    {header: 'Department', key: 'Department', width: 25},
    {header: 'Job Position', key: 'Job Position', width: 25},

    {header: 'First Name', key: 'First Name', width: 25},
    {header: 'Last Name', key: 'Last Name', width: 25},
    {header: 'ID/Passport No.', key: 'ID/Passport No.', width: 25},
    {header: 'Gender', key: 'Gender', width: 15},
    {header: 'Phone No.', key: 'Phone No.', width: 15},
    {header: 'Email Address', key: 'Email Address', width: 25},

    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
    {header: 'Document', key: 'Document', width: 35}
];
//</editor-fold>

//<editor-fold desc="send_users">
exports = async ({company_ids, company_groups, collectionGroup, tbl, _group, name,}) => {
    // console.log('*********************************************')
    // console.log('send_users', collectionGroup)
    // console.log('*********************************************')

    const users_by_company_snapshots = await get_users_by_company_snapshots({company_ids, _group,});

    for (let j = 0; j < users_by_company_snapshots.length; j++) {
        const {docs: user_docs} = users_by_company_snapshots[j];
        //each docs / company
        const firstUserDoc = user_docs[0];
        const firstUser = {id: firstUserDoc.id, data: firstUserDoc.data()};
        const {company_id, username} = firstUser.data;
        if (company_id !== "qPFSzXKRmPBUwUztZ379") {
            //qPFSzXKRmPBUwUztZ379 Me
            //4hKU3CF7tder8OhqoGrf Gobonzela
            //A3RpXSVOhVKnZmmjS0DJ SHEQ Solve
            return;
        }

        let sentList = company_groups[company_id];
        sentList = await get_sentList({sentList});

        console.log('------send_users firstUser', username, company_id, sentList.length, "\n\n");

        const processes_users_with_sentList = get_processes_users_with_sentList({user_docs, sentList});

        for (let n = 0; n < processes_users_with_sentList.length; n++) {
            await send_final(_group, name, processes_users_with_sentList[n]);
        }
    }
};
//</editor-fold>

//<editor-fold desc="send_final">
const send_final = async (
    _group, name,
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

    await send_expired({sheets, columns, item, _group, name,});
    await send_to_expire({sheets, columns, item, _group, name,});
    await send_no_expiry({sheets, columns, item, _group, name,});

    const folder = "Employees-Documents-Expiry";
    const fileName = (name.plural + "-" + id + "-" + n) + ".xlsx";
    const dataUri = await createExcelFileSheets({folder, fileName, sheets});
    // console.log("dataUri", !!dataUri)
};
//</editor-fold>

//<editor-fold desc="get_processes_users_with_sentList">
const get_processes_users_with_sentList = ({user_docs, sentList}) => {
    return user_docs.map(doc => ({id: doc.id, data: doc.data()})).map((
        {
            id, data: {username, user_id, client, project, site, client_id, project_id, site_id, company_id}
        }
    ) => {
        const res = {
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
        if (!client && !client_id) {
            return {...res, sentList};
        }

        const filter = (key, obj, obj_id) => (
            {
                data: {[key]: o, [key + '_id']: o_id}
            }
        ) => (o_id && obj_id === o_id) || (o && o.id === obj && obj.id);

        if (!project && !project_id) {
            return {
                ...res,
                sentList: sentList.filter(filter('client', client, client_id))
            };
        }
        if (!site && !site_id) {
            return {
                ...res,
                sentList: sentList.filter(filter('project', project, project_id))
            };
        }
        return {
            ...res,
            sentList: sentList.filter(filter('site', site, site_id))
        };
    }).filter(({sentList}) => !sentList.isEmpty());
};
//</editor-fold>

//<editor-fold desc="get_sentList">
const get_sentList = async ({sentList}) => {
    return (await Promise.all(sentList.map(async ({ref, id, data, data: {employee}}) => {
        const snapshot = await db_hr.collection('employees').doc(employee.id).get();
        // console.log("sentList---", data.expiry_date, Dates.formatDate(data.expiry_date))
        if (snapshot.exists) {
            data.employee = {id: snapshot.id, data: snapshot.data()};
        } else {
            // console.log("---errr", employee.id, employee.lname, employee.fname)
            return;
        }

        return {ref, id, data};
    }))).filter(v => !!v);
};
//</editor-fold>

//<editor-fold desc="get_users_by_company_snapshots">
const get_users_by_company_snapshots = async ({company_ids, _group,}) => {
    const users_query = (company_id) => db.collection('default_users').where('company_id', '==', company_id).
        // where('removed', '==', false).
        where('receive_expired_docs_notifs', '==', true);

    return await Promise.all(company_ids.map(async company_id => await users_query(company_id).get()));
};
//</editor-fold>