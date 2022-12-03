// <editor-fold defaultstate="collapsed" desc="getDBTblPath">
exports.getDBTblPath = (access_type) => {
    if (access_type === 'User') {
        return 'default_users';
    } else if (access_type === 'COID Provider') {
        return 'plugin_sheq_assist_COID_Providers';
    } else if (access_type === 'MedicalPractitioner') {
        return 'plugin_sheq_assist_medical_practitioners';
    }
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="getDBUser">
exports.getDBUser = async (uid) => {
    if (!uid) {
        return null;
    }
    
    console.log('getDBUser', uid)
    const doc_ref = await db.collection('default_users').doc(uid);
    const snapshot = await doc_ref.get();
    if (!snapshot.exists) {
        return null;
    }

    return {doc_ref, db_user: {id: snapshot.id, data: snapshot.data()}};
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="isDBCOIDProvider">
exports.isDBCOIDProvider = async (access_type, id) => {
    if (access_type !== 'User') {
        return;
    }

    const query_ref = await db.collection('plugin_manager').
            where('data.key', '==', 'plugin_claim_management');//Promise < DocumentReference < T > >
    const querySnapshot = await query_ref.get();
    if (querySnapshot.empty) {
        return;
    }
    const doc = querySnapshot.docs[0];

    const {data: {modules}} = doc.data();
    const module = modules.find(({key, company_list = []}) => key === '_03_Claim_Management_For_ServiceProviders');
    if (module) {
        const {company_list = []} = module;
        return company_list.contains(id);
    }
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="isDBMedicalCenterProvider">
exports.isDBMedicalCenterProvider = async (access_type, id) => {
    if (access_type !== 'User') {
        return;
    }

    const query_ref = await db.collection('plugin_manager').
            where('data.key', '==', 'plugin_claim_management');//Promise < DocumentReference < T > >
    const querySnapshot = await query_ref.get();
    if (querySnapshot.empty) {
        return null;
    }
    const doc = querySnapshot.docs[0];

    const {data: {modules}} = doc.data();
    const module = modules.find(({key, company_list = []}) => key === '_02_Claim_Management_For_MedicalCenters');
    if (module) {
        const {company_list = []} = module;
        return company_list.contains(id);
    }
};
// </editor-fold>
