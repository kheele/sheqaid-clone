global.addCustomUserClaims = (uid, claims) => {
    return admin.auth().getUser(uid).then(({customClaims = {}}) => {
        if(claims.access_type_list) {
            claims.access_type_list = {...(customClaims.access_type_list || {}), ...claims.access_type_list};
        }
        return admin.auth().setCustomUserClaims(uid, { ...customClaims, ...claims });
    });
};

global.setCustomUserClaims = (uid, claims) => 
    admin.auth().getUser(uid).then(({customClaims}) =>
        admin.auth().setCustomUserClaims(uid, claims));

// <editor-fold defaultstate="collapsed" desc="getDBUser">
exports.getDBUser = async (tbl, uid) => {
    if (!tbl) {
        return null;
    }
    if (!uid) {
        return null;
    }

    console.log('getDBUser', tbl, uid)
    const doc_ref = await db.collection(tbl).doc(uid);
    const snapshot = await doc_ref.get();
    if (!snapshot.exists) {
        return null;
    }

    return {doc_ref, db_user: {id: snapshot.id, data: snapshot.data()}};
};
// </editor-fold>
