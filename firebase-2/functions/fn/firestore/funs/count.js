
const {getValue, getBefore, getAfter} = require('./get');
const {eventExists, valueBefore, valueChange} = require('./is');

exports.conditionCounter = conditionCounter = async ({
change, ctx, query: {KEY, KEY_PARENT, op: operator, val: value, val_parent}, counter, colId = '', parentName, active, del = false, add = true
}) => {
    // don't run if repeated function
//    if (await eventExists(ctx)) {
//        return null;
//    }

//    const is_removed_changed = !active && valueChange(change, 'removed');
//    const is_changed = valueChange(change, KEY);

    // if no valueChange or no change in expression eval
//    if (!is_changed && !is_removed_changed/* || !changeBool*/) {
//        return null;
//    }
//    if (!is_changed) {
//        return null;
//    }

    counter.field = val_parent ? `${value}-${val_parent}` : `${value}`;

    const countSnap = await counter.doc.get();
    if (countSnap.get(counter.field)) {
        counter.incrementBy(add ? 1 : -1);
    } else {
// increment size if key exists
        return db_hr.runTransaction(async (t) => {
            const tbl = ctx.resource.name.split('/')[5];
            let q = db_hr.collection(tbl).where(KEY, operator, value);
            if(val_parent) {
                q = q.where(KEY_PARENT, '==', val_parent);
            }
            const colSnap = await t.get(q);
            counter.incrementBy(colSnap.size);

            // collection name
//            const countRef = db_hr.collection(tbl).doc(colId);
//            let _countName;
//            if (active) {
//                _countName = `${value}_active`;
//            } else {
//                _countName = `${value}_removed`;
//            }
//
//            console.log('Updating ', _countName, ' counter on ', countRef.path);
//
//            const snapshot = await t.get(countRef);
//            const _n = add ? 1 : -1;
//            const i = admin_hr.firestore.FieldValue.increment(_n);
//            const attrs = {[_countName]: snapshot.exists ? i : 1};
//
//            console.log('Updated ', _countName, ' counter on ', countRef.path, JSON.stringify(attrs));
//
//            return t.set(countRef, attrs, {merge: true});
        }).catch((e) => {
            console.log(e);
        });

}
};

exports.countExec = async (change, ctx, counters) => {
    if (await eventExists(ctx)) {
        return;
    }

    const promises = counters.docs.map(({counter, fn}) => fn(change, ctx, counter));
    return Promise.all(promises);
};

exports.countByKey = countByKey = async ({change, ctx, counter, KEY, KEY_PARENT, name, incNull = true}) => {
    const val = getValue(change, KEY);

    const props = {change, ctx, query: {KEY, KEY_PARENT, op: '=='}, colId: name, counter};

    if (valueChange(change, KEY)) {
        if (valueCreate(change, KEY)) {
            //increment
            props.query.val = val;
            return await conditionCounter(props);
        }
        if (valueDelete(change, KEY)) {
            const valBefore = getBefore(change, KEY);
            const valAfter = val;
            //decrement
            props.query.val = valBefore;
            await conditionCounter({...props, add: false});
            if (incNull) {
                //increment
                props.query.val = null;
                props.query.val_parent = getValue(change, KEY_PARENT);
                await conditionCounter(props);
            }
            return;
        }

        const promises = [];
        if (valueBefore(change, KEY)) {
            const valBefore = getBefore(change, KEY);
            //decrement
            props.query.val = valBefore;
            promises.push(conditionCounter({...props, add: false}));
        }
        if (valueAfter(change, KEY)) {
            const valAfter = val;
            //increment
            props.query.val = valAfter;
            promises.push(conditionCounter(props));
        }
        await Promise.all(promises);
    } else {
        if (val) {//increment
            props.query.val = val;
            await conditionCounter(props);
        } else if (incNull) {//increment
            props.query.val = null;
            props.query.val_parent = getValue(change, KEY_PARENT);
            await conditionCounter(props);
        }
    }
};

exports.countByAny = ({KEY, name, incNull}) => async (change, ctx, counter) => {
    return countByKey({change, ctx, counter, KEY, name, incNull});
};

exports.countByCompany = async (change, ctx, counter) => {
    return countByKey({change, ctx, counter, KEY: 'company_id', name: 'company', incNull: false});
};

exports.countByClient = async (change, ctx, counter) => {
    return countByKey({change, ctx, counter, KEY: 'client_id', KEY_PARENT: 'company_id', name: 'client'});
};

exports.countByProject = async (change, ctx, counter) => {
    return countByKey({change, ctx, counter, KEY: 'project_id', KEY_PARENT: 'client_id', name: 'project'});
};

exports.countBySite = async (change, ctx, counter) => {
    return countByKey({change, ctx, counter, KEY: 'site_id', KEY_PARENT: 'project_id', name: 'site'});
};

exports.countByDepartment = async (change, ctx, counter) => {
    return countByKey({change, ctx, counter, KEY: 'optional_info.department.id', name: 'department', incNull: false});
};

exports.countByJobPosition = async (change, ctx, counter) => {
    return countByKey({change, ctx, counter, KEY: 'optional_info.job_position.id', name: 'job_position', incNull: false});
};

exports.countByDepartmentId = async (change, ctx, counter) => {
    return countByKey({change, ctx, counter, KEY: 'department_id', name: 'department', incNull: false});
};

exports.countByJobPositionId = async (change, ctx, counter) => {
    return countByKey({change, ctx, counter, KEY: 'job_position_id', name: 'job_position', incNull: false});
};
