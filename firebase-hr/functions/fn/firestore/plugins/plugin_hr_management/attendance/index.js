const {
    create: {createAutoIncrementID, createStats}, 
    count: {countByCompany, countByClient, countByProject, countBySite}
} = require('../../../funs');

const tbl = 'plugin_sheq_assist_attendance';
exports.onCreate = functions.firestore.document(`${tbl}/{doc}`).onCreate(async (snapshot, ctx) => {

//    const {id} = snapshot;
//    const {
//        created_at,
//        client, project, site,
//        //
//    } = snapshot.data();
//
//    const col_counters_name = `${tbl}_counters_`;
//
//    const {FieldValue} = admin2.firestore;
//
//    let batch = db2.batch();
//    await Promise.all([
//        createStats({batch, tbl: col_employees_active, client, project, site, addProps: () => {
//                return {
//                    total: FieldValue.increment(1)
//                };
//            }}),
//        createStats({batch, tbl: col_supervisors, client, project, site, addProps: () => {
//                return {
//                    total: FieldValue.increment(1)
//                };
//            }})
//    ]);
//    await batch.commit();

    const ref_num = await createAutoIncrementID(tbl, snapshot.id);
    console.log(tbl, 'onCreate', ref_num)
});
//exports.onUpdate = functions.firestore.document(`${tbl}/{doc}`).onCreate(async (change, ctx) => {
//    const col_counters_name = `${tbl}_counters_`;
//
//    const {FieldValue} = admin2.firestore;
//
//    let batch = db2.batch();
//
//    const promises = [];
//    if (isRemoved(change)) {
////        promises.push(...[
////            createStats({batch, tbl: col_employees_removed, client, project, site, addProps: () => {
////                    return {
////                        total: FieldValue.increment(1)
////                    };
////                }}),
////            createStats({batch, tbl: col_employees_active, client, project, site, addProps: () => {
////                    return {
////                        total: FieldValue.increment(-1)
////                    };
////                }})
////        ]);
//    } else if (isRestored(change)) {
////        promises.push(...[
////            createStats({batch, tbl: col_employees_active, client, project, site, addProps: () => {
////                    return {
////                        total: FieldValue.increment(1)
////                    };
////                }}),
////            createStats({batch, tbl: col_employees_removed, client, project, site, addProps: () => {
////                    return {
////                        total: FieldValue.increment(-1)
////                    };
////                }})
////        ]);
//    }
//    await Promise.all(promises);
//    await batch.commit();
//
//    console.log(tbl, 'onUpdate')
//});

const isRemoved = (change) => {
    const {removed: oldRemoved} = change.before.data();
    const {removed: newRemoved} = change.after.data();
    return !oldRemoved && newRemoved;
};

const isRestored = (change) => {
    const {removed: oldRemoved} = change.before.data();
    const {removed: newRemoved} = change.after.data();
    return oldRemoved && !newRemoved;
};