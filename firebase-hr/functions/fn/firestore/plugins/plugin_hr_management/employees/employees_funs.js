const {
    is: {
        IS_REMOVED, IS_ADDED, IS_CHANGED, IS_UNCHANGED, IS_UNKNOWN
    }
} = require('../../../funs');

const isDepartmentAndJobPositionChangedImpl = (change, key) => {
    const {optional_info: old_optional_info} = change.before.data();
    const {optional_info: new_optional_info} = change.after.data();

    if (!old_optional_info && !new_optional_info) {
        return {event: IS_UNCHANGED};
    }
    if (old_optional_info && !new_optional_info) {
        const {[key]: old_key} = old_optional_info;
        if (!old_key) {
            return {event: IS_UNCHANGED};
        }
        return {event: IS_REMOVED, removed: old_key};
    }
    if (!old_optional_info && new_optional_info) {
        const {[key]: new_key} = new_optional_info;
        if (!new_key) {
            return {event: IS_UNCHANGED};
        }
        return {event: IS_ADDED, added: new_key};
    }

    const {[key]: old_key} = old_optional_info;
    const {[key]: new_key} = new_optional_info;
    if (!old_key && !new_key) {
        return {event: IS_UNCHANGED};
    }
    if (old_key && !new_key) {
        return {event: IS_REMOVED, removed: old_key};
    }
    if (!old_key && new_key) {
        return {event: IS_ADDED, added: new_key};
    }
    if (old_key && new_key) {
        if (old_key.id === new_key.id) {
            return {event: IS_UNCHANGED};
        }
        return {event: IS_CHANGED, removed: old_key, added: new_key};
    }

    return {event: IS_UNKNOWN};
};

exports.isDepartmentChanged = (change) => {
    return isDepartmentAndJobPositionChangedImpl(change, 'department');
};
exports.isJobPositionChanged = (change) => {
    return isDepartmentAndJobPositionChangedImpl(change, 'job_position');
};

exports.onIncrement = (key, val, props, {exists, attrs, KEY_ALL, y, m}) => {
    if (exists) {
        const {[key]: old_key} = attrs;

        if (old_key) {
            if (val) {
                if (old_key[val.id]) {
                    old_key[val.id] = {...old_key[val.id], ...props};//merge
                } else {
                    old_key[val.id] = props;
                }
            } else {
                if (old_key[KEY_ALL]) {
                    old_key[KEY_ALL] = {...old_key[KEY_ALL], ...props};//merge
                } else {
                    old_key[KEY_ALL] = props;
                }
            }
        }
    } else {
        if (val) {
            attrs[key][val.id] = props;
        } else {
            attrs[key][KEY_ALL] = props;
        }
    }
};