const {
    create: {createAutoIncrementID, createStats},
    count: {
        countExec,
        countByCompany, countByClient, countByProject, countBySite,
        countByDepartment, countByJobPosition
    },
    is: {
        IS_REMOVED, IS_ADDED, IS_CHANGED, IS_UNCHANGED, IS_UNKNOWN,
        isNoRestoredRemoved, isRemoved, isRestored
    }
} = require('../../../funs');

const {isDepartmentChanged, isJobPositionChanged, onIncrement} = require('./employees_funs');

const tbl = 'plugin_sheq_assist_employees';

const counters = {
    active: {
        col: db.collection(`${tbl}_active_counters`),
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
    },
    removed: {
        col: db.collection(`${tbl}_removed_counters`),
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
    }
};

exports.onCreate = functions.firestore.document(`${tbl}/{doc}`).onCreate(async (snapshot, ctx) => {
    /*
     //    const {id} = snapshot;
     //    const {
     //        created_at,
     //        company_id,
     //        client_id, project_id, site_id,
     //        //
     //        optional_info,
     //        removed
     //    } = snapshot.data();
     //
     //    const col_counters_name = `${tbl}_counters_`;
     //    const col_employees_active = `${col_counters_name}employees_active`;
     //    const col_employees_removed = `${col_counters_name}employees_removed`;
     ////    const col_supervisors = `${col_counters_name}supervisors`;
     //
     //    const {FieldValue} = admin.firestore;
     //
     //    let batch = db.batch();
     //
     //    const promises = [];
     //    if (removed) {
     //        promises.push(createStats({
     //            batch, tbl: col_employees_removed, company_id, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
     //                const props = {total: FieldValue.increment(1)};
     //
     //                if (optional_info) {
     //                    const {department, job_position} = optional_info;
     //                    onIncrement('department', department, props, {exists, attrs, KEY_ALL, y, m});
     //                    onIncrement('job_position', job_position, props, {exists, attrs, KEY_ALL, y, m});
     //                }
     //                return props;
     //            }
     //        }));
     //    } else {
     //        promises.push(createStats({
     //            batch, tbl: col_employees_active, company_id, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
     //                const props = {total: FieldValue.increment(1)};
     //
     //                if (optional_info) {
     //                    const {department, job_position} = optional_info;
     //                    onIncrement('department', department, props, {exists, attrs, KEY_ALL, y, m});
     //                    onIncrement('job_position', job_position, props, {exists, attrs, KEY_ALL, y, m});
     //                }
     //                return props;
     //            }
     //        }));
     //    }
     //    await Promise.all([
     //        ...promises
     ////        createStats({batch, tbl: col_supervisors, company_id, client_id, project_id, site_id, addProps: ({exists, attrs, y, m}) => {
     ////                return {
     ////                    total: FieldValue.increment(1)
     ////                };
     ////            }})
     //    ]);
    await batch.commit();
     */    

    const ref_num = await createAutoIncrementID(tbl, snapshot.id);
    console.log(tbl, 'onCreate', ref_num)
});

/*
 //exports.onUpdate = functions.firestore.document(`${tbl}/{doc}`).onCreate(async (change, ctx) => {
 //    const col_counters_name = `${tbl}_counters_`;
 //    const col_employees_active = `${col_counters_name}employees_active`;
 //    const col_employees_removed = `${col_counters_name}employees_removed`;
 ////    const col_supervisors = `${col_counters_name}supervisors`;
 //
 //    const {FieldValue} = admin.firestore;
 //
 //    let batch = db.batch();
 //
 //    const promises = [];
 //    if (isRemoved(change)) {
 //        const {
 //            created_at,
 //            client_id, project_id, site_id,
 //            //
 //            optional_info
 //        } = change.after.data();
 //
 //        promises.push(...[
 //            createStats({batch, tbl: col_employees_removed, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
 //                    const props = {total: FieldValue.increment(1)};
 //
 //                    if (optional_info) {
 //                        const {department, job_position} = optional_info;
 //                        onIncrement('department', department, props, {exists, attrs, KEY_ALL, y, m});
 //                        onIncrement('job_position', job_position, props, {exists, attrs, KEY_ALL, y, m});
 //                    }
 //                    return props;
 //                }}),
 //            createStats({batch, tbl: col_employees_active, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
 //                    const props = {total: FieldValue.increment(-1)};
 //
 //                    if (optional_info) {
 //                        const {department, job_position} = optional_info;
 //                        onIncrement('department', department, props, {exists, attrs, KEY_ALL, y, m});
 //                        onIncrement('job_position', job_position, props, {exists, attrs, KEY_ALL, y, m});
 //                    }
 //
 //                    return props;
 //                }})
 //        ]);
 //    } else if (isRestored(change)) {
 //        const {
 //            created_at,
 //            client_id, project_id, site_id,
 //            //
 //            optional_info
 //        } = change.after.data();
 //
 //        promises.push(...[
 //            createStats({batch, tbl: col_employees_active, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
 //                    const props = {total: FieldValue.increment(1)};
 //
 //                    if (optional_info) {
 //                        const {department, job_position} = optional_info;
 //                        onIncrement('department', department, props, {exists, attrs, KEY_ALL, y, m});
 //                        onIncrement('job_position', job_position, props, {exists, attrs, KEY_ALL, y, m});
 //                    }
 //
 //                    return props;
 //                }}),
 //            createStats({batch, tbl: col_employees_removed, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
 //                    const props = {total: FieldValue.increment(-1)};
 //
 //                    if (optional_info) {
 //                        const {department, job_position} = optional_info;
 //                        onIncrement('department', department, props, {exists, attrs, KEY_ALL, y, m});
 //                        onIncrement('job_position', job_position, props, {exists, attrs, KEY_ALL, y, m});
 //                    }
 //                    return props;
 //                }})
 //        ]);
 //    } else if (isNoRestoredRemoved(change)) {
 //        {
 //            const {event, removed, added} = isDepartmentChanged(change);
 //            if (event === IS_ADDED) {
 //                promises.push(...[
 //                    createStats({batch, tbl: col_employees_active, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
 //                            const props = {total: FieldValue.increment(1)};
 //                            const department = added;
 //                            onIncrement('department', department, props, {exists, attrs, KEY_ALL, y, m});
 //                            return null;
 //                        }})
 //                ]);
 //            } else if (event === IS_REMOVED) {
 //                promises.push(...[
 //                    createStats({batch, tbl: col_employees_active, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
 //                            const props = {total: FieldValue.increment(-1)};
 //                            const department = removed;
 //                            onIncrement('department', department, props, {exists, attrs, KEY_ALL, y, m});
 //                            return null;
 //                        }})
 //                ]);
 //            } else if (event === IS_CHANGED) {
 //                promises.push(...[
 //                    createStats({batch, tbl: col_employees_active, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
 //                            const props_added = {total: FieldValue.increment(1)};
 //                            const props_removed = {total: FieldValue.increment(-1)};
 //                            const department_added = added;
 //                            const department_removed = removed;
 //                            onIncrement('department', department_added, props_added, {exists, attrs, KEY_ALL, y, m});
 //                            onIncrement('department', department_removed, props_removed, {exists, attrs, KEY_ALL, y, m});
 //                            return null;
 //                        }})
 //                ]);
 //            }
 //        }
 //
 //        {
 //            const {event, removed, added} = isJobPositionChanged(change);
 //            if (event === IS_ADDED) {
 //                promises.push(...[
 //                    createStats({batch, tbl: col_employees_active, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
 //                            const props = {total: FieldValue.increment(1)};
 //                            const job_position = added;
 //                            onIncrement('job_position', job_position, props, {exists, attrs, KEY_ALL, y, m});
 //                            return null;
 //                        }})
 //                ]);
 //            } else if (event === IS_REMOVED) {
 //                promises.push(...[
 //                    createStats({batch, tbl: col_employees_active, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
 //                            const props = {total: FieldValue.increment(-1)};
 //                            const job_position = removed;
 //                            onIncrement('job_position', job_position, props, {exists, attrs, KEY_ALL, y, m});
 //                            return null;
 //                        }})
 //                ]);
 //            } else if (event === IS_CHANGED) {
 //                promises.push(...[
 //                    createStats({batch, tbl: col_employees_active, client_id, project_id, site_id, addProps: ({exists, attrs, KEY_ALL, y, m}) => {
 //                            const props_added = {total: FieldValue.increment(1)};
 //                            const props_removed = {total: FieldValue.increment(-1)};
 //                            const job_position_added = added;
 //                            const job_position_removed = removed;
 //                            onIncrement('job_position', job_position_added, props_added, {exists, attrs, KEY_ALL, y, m});
 //                            onIncrement('job_position', job_position_removed, props_removed, {exists, attrs, KEY_ALL, y, m});
 //                            return null;
 //                        }})
 //                ]);
 //            }
 //        }
 //    }
 //
 //    await Promise.all(promises);
 //    await batch.commit();
 //
 //    console.log(tbl, 'onUpdate')
 //});
 */

exports.onWrite = functions.firestore.document(`${tbl}/{doc}`).onWrite(async (change, ctx) => {
//    const removed = getValue(change, 'removed');
    await Promise.all([countExec(change, ctx, counters.active), countExec(change, ctx, counters.removed)]);
});
//355