const {
    create: {createAutoIncrementID, createStats},
    count: {
        countExec,
        countByCompany, countByClient, countByProject, countBySite,
        countByDepartment, countByJobPosition
    }
} = require('../../../funs');

const tbl = 'plugin_sheq_assist_employees';
const collectionGroup = "employee_counselling_list";

const counters = {
    col: db.collection(`${tbl}_${collectionGroup}_counters`),
    get docs() {
        return this._docs ? this._docs : this._docs = [
            {id: 'company', fn: countByCompany},
            //orgs
            {id: 'client', fn: countByClient},
            {id: 'project', fn: countByProject},
            {id: 'site', fn: countBySite},
            //
            {id: 'department', fn: countByDepartment},
            {id: 'job_position', fn: countByJobPosition}
        ].map(({id, fn}) => {
            return {counter: new Counter(this.col.doc(id)), fn};
        });
    }
};

exports.onWrite = functions.firestore.document(`${tbl}/{doc}`).onWrite(async (change, ctx) => {
//    const removed = getValue(change, 'removed');
    await countExec(change, ctx, counters);
});