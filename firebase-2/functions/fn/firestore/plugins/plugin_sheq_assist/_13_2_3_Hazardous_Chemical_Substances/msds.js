const {
    create: {createAutoIncrementID},
    count: {
        countExec,
        countByAny, countByCompany, countByClient, countByProject, countBySite
    }
} = require('../../../funs');

const tbl = 'plugin_sheq_assist_Hazardous_Chemical_Substances_msds';

const counters = {
    col: db_hr.collection(`${tbl}_counters`),
    get docs() {
        return this._docs ? this._docs : this._docs = [
            {id: 'company', fn: countByCompany},
            //orgs
            {id: 'client', fn: countByClient},
            {id: 'project', fn: countByProject},
            {id: 'site', fn: countBySite},
            //
            {id: 'category', fn: countByAny({KEY: 'category', name: 'category', incNull: false})},
            {id: 'manufacturer', fn: countByAny({KEY: 'manufacturer', name: 'manufacturer', incNull: false})},
            {id: 'risk_level', fn: countByAny({KEY: 'risk_level', name: 'risk_level', incNull: false})},
        ].map(({id, fn}) => {
            return {counter: new Counter(this.col.doc(id)), fn};
        });
    }
};

exports.onCreate = functions.firestore.document(`${tbl}/{doc}`).onCreate(async (snapshot, ctx) => {
    const ref_num = await createAutoIncrementID(tbl, snapshot.id);
    console.log(tbl, 'onCreate', ref_num)
});

exports.onWrite = functions.firestore.document(`${tbl}/{doc}`).onWrite(async (change, ctx) => {
//    await countExec(change, ctx, counters);
});