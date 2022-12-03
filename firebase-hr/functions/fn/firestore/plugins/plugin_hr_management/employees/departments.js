const {
    create: {createAutoIncrementID},
    count: {
        countExec, 
        countByCompany, countByClient
    }
} = require('../../../funs');

const tbl = 'plugin_sheq_assist_departments';

const counters = {
    col: db.collection(`${tbl}_counters`),
    get docs() {
        return this._docs ? this._docs : this._docs = [
            {id: 'company', fn: countByCompany},
            //orgs
            {id: 'client', fn: countByClient}
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
    await countExec(change, ctx, counters);
});