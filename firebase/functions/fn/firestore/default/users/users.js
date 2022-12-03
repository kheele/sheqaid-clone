
exports.onCreate = functions.firestore.document('default_users/{doc}').onCreate(async (snapshot, ctx) => {
    const {id: uid} = snapshot;
    const {
        created_at,
        company_id,
        client_id, project_id, site_id,
        client: my_client, project: my_project, site: my_site
    } = snapshot.data();

    const currentCustomClaims = {
//        access_type,
        access_type_list: {User: true},
        company_id,
//            p: {//permissions
//                m: permissions_modules,
//                o: permissions_other
//            }
    };
    
    if (my_client) {
        currentCustomClaims.my_client = my_client;
    }
    if (my_project) {
        currentCustomClaims.my_project = my_project;
    }
    if (my_site) {
        currentCustomClaims.my_site = my_site;
    }

    await setCustomUserClaims(uid, currentCustomClaims);
});