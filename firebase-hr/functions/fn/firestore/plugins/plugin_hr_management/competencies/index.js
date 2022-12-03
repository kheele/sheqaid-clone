const {
    create: {createAutoIncrementID, createStats},
    count: {
        countExec,
        countByCompany, countByClient, countByProject, countBySite,
        countByDepartmentId, countByJobPositionId
    }
} = require('../../../funs');

const tbl = 'plugin_sheq_assist_employees';
const collectionGroup = "competency_list";

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
            {id: 'department', fn: countByDepartmentId},
            {id: 'job_position', fn: countByJobPositionId}
        ].map(({id, fn}) => {
            return {counter: new Counter(this.col.doc(id)), fn};
        });
    }
};

exports.onWrite = functions.firestore.document(`${tbl}/{employeeDoc}/${collectionGroup}/{doc}`).onWrite(async (change, ctx) => {
//    const removed = getValue(change, 'removed');
    await countExec(change, ctx, counters);
});