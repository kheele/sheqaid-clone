//
//const {createAutoIncrementID, createStats, createCountConf} = require('../../../Funs');

/*
 * 1. create counter table
 * 2. create table name col
 * 3. create last ID col
 */

/*
 * 1. claim # vs no claim # / time
 * 2. claim status / time
 * 3. status / time
 * 4. injury vs disease / time
 */

const tbl = 'plugin_sheq_assist_coida_claims';
exports.onCreate = functions.firestore.document(`${tbl}/{doc}`).onCreate(async (snapshot, ctx) => {
//
//    const {id} = snapshot;
//    const {
//        created_at,
//        client, project, site,
//        //
//        employee, employee_id,
//        claim_number,
//        accident_date,
//        //
//        wcl_2 = {},
//        wcl_4 = {},
//        wcl_5_list = [],
//        wcl_6 = {},
//        annexture_1 = {},
//        //
//        status,
//        claim_status
//    } = snapshot.data();
//
//    const {date_resumed_work} = wcl_2;
//
//    const col_counters_name = `${tbl}_counters_`;
//    const col_claim_number = `${col_counters_name}claim_number`;
//    const col_injury_vs_disease = `${col_counters_name}injury_vs_disease`;
//    const col_status = `${col_counters_name}status`;
//    const col_claim_status = `${col_counters_name}claim_status`;
//
//    const {FieldValue} = admin.firestore;
//
//    const __accident_date = Dates.parse(accident_date);
//    const y = __accident_date.getFullYear();
//    const m = __accident_date.getMonth();
//
//    let batch = db.batch();
//    await Promise.all([
//        createStats({batch, tbl: col_claim_number, client, project, site, y, m, addProps: (y, m) => {
//            return {
//                yes: createCountConf(y, m, () => FieldValue.increment(claim_number ? 1 : 0)),
//                no: createCountConf(y, m, () => FieldValue.increment(claim_number ? 0 : 1))
//            };
//        }}),
//        createStats({batch, tbl: col_injury_vs_disease, client, project, site, y, m, addProps: (y, m) => {
//            return {
//                injury: createCountConf(y, m, () => FieldValue.increment(wcl_2 ? 1 : 0)),
//                disease: createCountConf(y, m, () => FieldValue.increment(wcl_2 ? 0 : 1))
//            };
//        }}),
//        createStats({batch, tbl: col_status, client, project, site, y, m, addProps: (y, m) => {
//            return {
//                [status]: createCountConf(y, m, () => FieldValue.increment(1))
//            };
//        }}),
//        createStats({batch, tbl: col_claim_status, client, project, site, y, m, addProps: (y, m) => {
//            if (!claim_status)
//                return {};
//            return {
//                [claim_status]: createCountConf(y, m, () => FieldValue.increment(1))
//            };
//        }})
//    ]);
//    await batch.commit();
//
//    const ref_num = await createAutoIncrementID(tbl);
//
//    const doc_ref = await db.collection(tbl).doc(snapshot.id);
//    await doc_ref.set({ref_num}, {merge: true});
//    console.log('completed', ref_num)
});