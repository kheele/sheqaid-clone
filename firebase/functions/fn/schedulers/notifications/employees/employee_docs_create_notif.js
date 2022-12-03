const {sendEmail} = require('./employee_docs_send_email');

exports.createNotif = async (
    {
        receipient_id,
        receipient_username,
        ids,
        company_id,
        client,
        project,
        site,
        client_id,
        project_id,
        site_id,
        user_id,
        tbl,
        collectionGroup,
        _group,
        name,
        desc
    }
) => {
    const data = {
        company_id,
        user_id,
        receipient_id,
        receipient_username,
        _target: {ids, tbl, collectionGroup, desc},
        _group,
        name, //{singular,plural}
        is_read: false,
        email_sent: false,
        removed: false
    };

    if (client) {
        data.client = client;
        data.client_id = client.id;
    }
    if (client_id && !data.client_id) {
        data.client_id = client_id;
    }

    if (project) {
        data.project = project;
        data.project_id = project.id;
    }
    if (project_id && !data.project_id) {
        data.project_id = project_id;
    }

    if (site) {
        data.site = site;
        data.site_id = site.id;
    }
    if (site_id && !data.site_id) {
        data.site_id = site_id;
    }

    const db_data = await db2.collection('default_notifications').add(data);
    const snapshot = await db_data.get();
    await sendEmail({snapshot, email: receipient_username, notifMsg: desc});
};
