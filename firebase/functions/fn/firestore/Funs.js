
exports.createAutoIncrementID = async (tbl) => {
    const doc_ref = db2.collection('auto_increment_id').doc(tbl);
    const lastID = await db2.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(doc_ref);
        return snapshot.exists ? admin2.firestore.FieldValue.increment(1) : 1;
    });
    const batch = db2.batch();
    batch.set(doc_ref, {lastID}, {merge: true});
    await batch.commit();

    return await db2.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(doc_ref);
        return snapshot.data().lastID;
    });
};

exports.createStats = async ({batch, tbl, client, project, site, y, m, addProps}) => {
    const col_ref = db2.collection(tbl).doc(`${client.id}-${m}-${y}`);
    batch.set(col_ref, {
        ...addProps(y, m),
        client_id: client.id,
        project_id: project.id,
        site_id: site.id
    }, {merge: true});

//    col_ref.where('client_id', '==', client_id).
//            where('project_id', '==', project_id).
//            where('site_id', '==', site_id).
//            where(`injury.y`, '==', year).
//            where(`injury.m`, '==', month);
};

exports.createCountConf = (y, m, calc) => {
    return {
        y,
        m,
        n: calc()
    };
};