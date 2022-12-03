
exports.createAutoIncrementID = async (tbl, id) => {
    const doc_ref = db_hr.collection('auto_increment_id').doc(tbl);
    const lastID = await db_hr.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(doc_ref);
        return snapshot.exists ? admin_hr.firestore.FieldValue.increment(1) : 1;
    });
    
    const batch = db_hr.batch();
    batch.set(doc_ref, {lastID}, {merge: true});
    await batch.commit();

    const ref_num = await db_hr.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(doc_ref);
        return snapshot.data().lastID;
    });
    
//    const doc_ref = await db_hr.collection(tbl).doc(id);
//    await doc_ref.set({ref_num}, {merge: true});
    
    return db_hr.runTransaction(async (transaction) => {
        const doc_ref = db_hr.collection(tbl).doc(id);
        transaction.set(doc_ref, {ref_num}, {merge: true});
        return ref_num;
    });
//    return db_hr.runTransaction(async (transaction) => {
//        const auto_doc_ref = db_hr.collection('auto_increment_id').doc(tbl);
//        const snapshot = await transaction.get(auto_doc_ref);
//        const lastID = snapshot.exists ? admin_hr.firestore.FieldValue.increment(1) : 1;
//        transaction.set(auto_doc_ref, {lastID}, {merge: true});
//
//        const ref_num = lastID;
//        const doc_ref = db_hr.collection(tbl).doc(id);
//        transaction.set(doc_ref, {ref_num}, {merge: true});
//        return ref_num;
//    });
};

exports.createStats = async ({batch, tbl, company_id, client_id, project_id, site_id, y, m, addProps}) => {
//    const id = (client_id ? client_id : 'All') + (m ? `-${m}`:'') + (y ? `-${y}`:'');

    return db_hr.runTransaction(async (transaction) => {
        const KEY_ALL = 'All';

        const doc_ref = db_hr.collection(tbl).doc(company_id);
        const snapshot = await transaction.get(doc_ref);
        const {exists, attrs} = snapshot.exists ?
                {exists: true, attrs: snapshot.data()} :
                {exists: false, attrs: {client: {}, project: {}, site: {}}};

        const props = addProps({exists, attrs, KEY_ALL, y, m});//{total: 1}

        if (props !== null) {
            if (exists) {
                const {client: old_client, project: old_project, site: old_site} = attrs;
                if (old_client) {
                    if (client_id) {
                        if (old_client[client_id]) {
                            old_client[client_id] = {...old_client[client_id], ...props};//merge
                        } else {
                            old_client[client_id] = props;
                        }
                    } else {
                        if (old_client[KEY_ALL]) {
                            old_client[KEY_ALL] = {...old_client[KEY_ALL], ...props};//merge
                        } else {
                            old_client[KEY_ALL] = props;
                        }
                    }
                }
                if (old_project) {
                    if (project_id) {
                        if (old_project[project_id]) {
                            old_project[project_id] = {...old_project[project_id], ...props};//merge
                        } else {
                            old_project[project_id] = props;
                        }
                    } else {
                        if (old_project[KEY_ALL]) {
                            old_project[KEY_ALL] = {...old_project[KEY_ALL], ...props};//merge
                        } else {
                            old_project[KEY_ALL] = props;
                        }
                    }
                }
                if (old_site) {
                    if (site_id) {
                        if (old_site[site_id]) {
                            old_site[site_id] = {...old_site[site_id], ...props};//merge
                        } else {
                            old_site[site_id] = props;
                        }
                    } else {
                        if (old_site[KEY_ALL]) {
                            old_site[KEY_ALL] = {...old_site[KEY_ALL], ...props};//merge
                        } else {
                            old_site[KEY_ALL] = props;
                        }
                    }
                }
            } else {
                if (client_id) {
                    attrs.client[client_id] = props;
                } else {
                    attrs.client[KEY_ALL] = props;
                }
                if (project_id) {
                    attrs.project[project_id] = props;
                } else {
                    attrs.project[KEY_ALL] = props;
                }
                if (site_id) {
                    attrs.site[site_id] = props;
                } else {
                    attrs.site[KEY_ALL] = props;
                }
            }
        }

        transaction.set(doc_ref, attrs, {merge: true});
    });
};

exports.createCountConf = (y, m, calc) => {
    return {
        y,
        m,
        n: calc()
    };
};