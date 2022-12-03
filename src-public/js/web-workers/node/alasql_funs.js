
alasql.fn.inArray = function (list, sub_key, comp, val) {
    if (comp.toLowerCase() === 'like') {
        val = val.substring(0, val.length - 1);
        const keys = sub_key.split('.');
        return list.anyMatch(v => {
            let _v;
            if (keys.length === 1) {
                _v = v[keys[0]];
            } else {
                _v = v[keys[0]][keys[1]];
            }
            return _v.toLowerCase().startsWith(val);
        });
    } else {
        const keys = sub_key.split('.');
        if (keys.length === 1) {
            return list.contains(val);
        } else {
            return list.filter(v => !!v[keys[0]]).map(v => v[keys[0]][keys[1]]).contains(val);
        }
    }
};

Array.prototype.alasqlSumInArray = function (sub_key, comp, val) {
    const total = this.map(v => parseInt(v[sub_key])).reduce((n1, n2) => n1 + n2);
    val = parseInt(val);
    if (comp.toLowerCase() === '<=') {
        return total <= val;
    } else if (comp.toLowerCase() === '>=') {
        return total >= val;
    } else if (comp.toLowerCase() === '=' || comp.toLowerCase() === '==' || comp.toLowerCase() === '===') {
        return total === val;
    } else {
        throw new Error('Only these comparators required [<=, >=, =, ==, ===]');
    }
};

Array.prototype.alasqlInArray = function (sub_key, comp, val) {
    if (comp.toLowerCase() === 'like') {
        val = val.toLowerCase().substring(0, val.length - 1);
        const keys = sub_key.split('.');
        return this.anyMatch(v => {
            let _v;
            if (keys.length === 1) {
                _v = v[keys[0]];
            } else {
                _v = v[keys[0]][keys[1]];
            }
            return _v.toLowerCase().startsWith(val);
        });
    } else {
        console.log('alasqlInArray', comp, val)
        if (isArray(val)) {
            console.log('alasqlInArray, anyMatch', this.anyMatch(v => val.contains(v[sub_key])))
            return this.anyMatch(v => val.contains(v[sub_key]));
        } else {
            return this.anyMatch(v => v[sub_key] === val);
        }
    }
};

Array.prototype.alasqlContains = function (comp, val) {
    if (comp.toLowerCase() === 'like') {
        val = val.toLowerCase().substring(0, val.length - 1);
        return this.anyMatch(v => v.toLowerCase().startsWith(val));
    } else {
        console.log('alasqlContains', comp, val)
        if (isArray(val)) {
            console.log('alasqlContains, anyMatch', this.anyMatch(v => val.contains(v)))
            return this.anyMatch(v => val.contains(v));
        } else {
            return this.anyMatch(v => v === val);
        }
    }
};