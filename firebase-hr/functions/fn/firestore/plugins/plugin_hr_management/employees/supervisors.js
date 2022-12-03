const {
    create: {createAutoIncrementID},
    count: {
        countExec, 
        countByCompany, countByClient, countByProject, countBySite
    }
} = require('../../../funs');

const tbl = 'plugin_sheq_assist_teams';

const counters = {
    col: db.collection(`plugin_sheq_assist_supervisors_counters`),
    get docs() {
        return this._docs ? this._docs : this._docs = [
            {id: 'company', fn: countByCompany},
            //orgs
            {id: 'client', fn: countByClient},
            {id: 'project', fn: countByProject},
            {id: 'site', fn: countBySite}
        ].map(({id, fn}) => {
            return {counter: new Counter(this.col.doc(id)), fn};
        });
    }
};

exports.onCreate = functions.firestore.document(`${tbl}/{doc}`).onCreate(async (snapshot, ctx) => {
    //find supervisor and check if they exist
    console.log(tbl, 'onCreate')
});

exports.onWrite = functions.firestore.document(`${tbl}/{doc}`).onWrite(async (change, ctx) => {
    //find supervisor and check if they exist
//    await countExec(change, ctx, counters);
});//35