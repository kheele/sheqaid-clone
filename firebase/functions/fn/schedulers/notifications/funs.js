exports.createNotif = async (item, tbl, _group, name, desc) => {
    const {
        id, data: { 
            company_id, user_id,
            client, project, site, client_id, project_id, site_id
        }
    } = item;
    const data = {
        company_id, user_id,
        _target: {id, tbl, desc},
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
    return await db_data.get();
};