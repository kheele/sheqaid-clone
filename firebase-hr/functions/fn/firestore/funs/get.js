const {valueBefore, valueAfter} = require('./is');

const objectValueByKey = (obj, key) => {
    const props = key.split('.');
    key = props.pop();
    try {
        const reduced = props.reduce((prev, curr) => prev[curr], obj);
        return reduced[key];
    } catch (e) {
        return undefined;
    }
};

exports.objectValueByKey = objectValueByKey;

/**
 * Get the after value or null
 * @param change
 * @param val
 */
exports.getAfter = (change, val) => {
    // simplify input data
    const after = change.after.exists ? change.after.data() : null;
    if (val === 'id') {
        return after ? change.after.id : undefined;
    }

    if (valueAfter(change, val)) {
        return objectValueByKey(after, val);
    }

    return undefined;
};

/**
 * Get the before value or null
 * @param change
 * @param val
 */
exports.getBefore = (change, val) => {
    // simplify input data
    const before = change.before.exists ? change.before.data() : null;
    if (val === 'id') {
        return before ? change.before.id : undefined;
    }

    if (valueBefore(change, val)) {
        return objectValueByKey(before, val);
    }

    return undefined;
};

/**
 * Returns the latest value of a field
 * @param change
 * @param val
 */
exports.getValue = (change, val) => {
    // simplify input data
    const after = change.after.exists ? change.after.data() : null;
    const before = change.before.exists ? change.before.data() : null;

    if (val === 'id') {
        return after ? change.after.id : change.before.id;
    }

    if (valueAfter(change, val)) {
        return objectValueByKey(after, val);
    }
    
    if (valueBefore(change, val)) {
        return objectValueByKey(before, val);
    }

    return undefined;
};