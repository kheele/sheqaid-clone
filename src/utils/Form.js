import {isObservable, isObservableArray, isObservableMap, isObservableObject, toJS} from "mobx";
import {convertMobxForFilter, Dates} from "./Utils";

class Form {

    fields = {};
    data = {};
    oneEvents = {};
    manyEvents = {};
    anyEvents;

    constructor(props) {
        this.onChange = this.onChange.bind(this);
        this.addChangeOne = this.addChangeOne.bind(this);
        this.addChangeMany = this.addChangeMany.bind(this);
        this.addChangeAny = this.addChangeAny.bind(this);
        this.getFormData = this.getFormData.bind(this);
    }

    onChange(val, name, el) {
        const {type} = el.props;
        const eventOne = this.oneEvents[name];
        const eventMany = this.manyEvents[name];
        const {anyEvents} = this;
        // if(type === 'checkbox') {
        //     if(isNullable(val)) {
        //         val = [];
        //     }
        // }
        if (Form.hasVal(val)) {
            if (type === 'number') {
                val = parseInt(val);
            }
            this.data[name] = val;
            this.fields[name] = el;
            eventOne && eventOne(el, val);
            eventMany && eventMany(el, name, val);
            anyEvents && anyEvents(el, name, val);
        } else if (isNullable(val) || isString(val)) {
            delete this.data[name];
            delete this.fields[name];
            eventOne && eventOne(el);
            eventMany && eventMany(el, name);
            anyEvents && anyEvents(el, name);
        }
    }

    addChangeOne(name, event) {
        this.oneEvents[name] = event;
    }

    addChangeMany(names, event) {
        if (isArray(names)) {
            names.forEach(name => {
                this.manyEvents[name] = event;
            });
        }
    }

    addChangeAny(event) {
        this.anyEvents = event;
    }

    isValid(name) {
        if (!isString(name)) {
            throw new Error(name + ' must be a string');
        }
        if (name in this.data) {
            const val = this.data[name];
            return Form.hasVal(val);
        }
        return false;
    }

    areValid(names) {
        if (isArray(names)) {
            for (var n = 0; n < names.length; n++) {
                if (!this.isValid(names[n]))
                    return false;
            }
            return true;
        } else if (isString(names)) {
            return this.isValid(names);
        } else {
            throw new Error(names + ' must be an array of a string');
        }
    }

    get(name) {
        if (!isString(name)) {
            throw new Error(name + ' must be a string');
        }

        return this.data[name];
    }

    getFormData(keys, val) {
        let filterData = {};

        if (isString(keys)) {
            const key = keys;
            setFilterDataValues(filterData, key, val);
        } else {
            keys.forEach(key => {
                let val = this.get(key);
                setFilterDataValues(filterData, key, val);
            });
        }

        return filterData;
    }

    get formData() {
        if (this.hasData) {
            return this.getFormData(this.toKeys);
        }
    }

    get hasData() {
        return !Object.keys(this.data).isEmpty();
    }

    get toArray() {
        return Object.keys(this.data).map(key => this.data[key]);
    }

    get toKeys() {
        return Object.keys(this.data);
    }

    reset() {
        this.data = {};
        Object.values(this.fields).forEach(el => el.reset && el.reset());
        this.fields = {};
    }

    static hasVal(val) {
        if (isNullable(val)) {
            return false;
        }

        if (isString(val)) {
            return !val.isEmpty();
        }

        if (isNumber(val) || isBoolean(val) || isDate(val) ||
            isArray(val) || isObject(val) || isObservable(val)
        ) {
            return true;
        }

        return !!val;
    }
}

const setFilterDataValues = (filterData, key, val) => {
    if (isDate(val)) {
        filterData[key] = Dates.formatDateSQL(val);
    } else if (isObservableArray(val) ||
        isArray(val)) {
        val = val.map(convertMobxForFilter);
        if (!val.isEmpty()) {
            filterData[key] = val;
        }
    } else if (isObservable(val) ||
        isObservableObject(val) ||
        isObservableMap(val) ||
        isObject(val)) {

        val = convertMobxForFilter(val);
        if (!!val) {
            processObject(filterData, val, key);
        }
    } else {
        filterData[key] = val;
    }
};

const processObject = (filterData, val, key) => {
    if (isDate(val.start) || isDate(val.end)) {
        filterData[key] = {};
        if (isDate(val.start)) {
            filterData[key].start = Dates.formatDateSQL(val.start);
        }
        if (isDate(val.end)) {
            filterData[key].end = Dates.formatDateSQL(val.end);
        }
    } else if (val.path) {
        filterData[key] = val.path;
    } else if (val.id) {
        const {id, data} = val;
        if (id) {
            if (key.endsWith('_id')) {
                filterData[key] = id;
                key = key.replace('_id', '');
            } else {
                filterData[key + '_id'] = id;
            }
        }

        // console.log('processObject', key, val);

        const {fname, lname, name, email, username, is_external} = data || val;
        filterData[key] = {is_external};
        if (id) {
            filterData[key]['id'] = id;
        }
        if (fname) {
            filterData[key]['fname'] = fname;
        }
        if (lname) {
            filterData[key]['lname'] = lname;
        }
        if (name) {
            filterData[key]['name'] = name;
        }
        if (email) {
            filterData[key]['email'] = email;
        }
        if (username) {
            filterData[key]['username'] = username;
        }
    } else {
        filterData[key] = val;
    }
};

export default Form;
