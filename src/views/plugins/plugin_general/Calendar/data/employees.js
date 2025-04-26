const employeesPath = 'plugin_sheq_assist/employees/';

const onSuccess = (state, key, displayTitle, extraProps) => {
    return res => {
        state.list.push(...res.map(item => {
            let {id, data, data: {created_at, employee, expiry_date}} = item;
            const {fname, lname} = employee;
            let title = displayTitle + " (" + (lname + ' ' + fname) + ')';
            if (extraProps && extraProps.titleKey) {
                title = data[extraProps.titleKey] + " " + title;
            }
            if (extraProps && extraProps.onProcessDate) {
                expiry_date = extraProps.onProcessDate(data);
            }
            return {
                start: new Date(expiry_date),
                end: new Date(expiry_date),
                title,
                item,
                key
            };
        }));
        state.dataError = false;
        state.dataLoaded = true;
    };
};

const onFailure = (state) => {
    return e => {
        console.log(e);
        state.dataError = true;
        state.dataLoaded = true;
    };
};

const contracts = (state, selectedDate, selectedView) => {
    workers.emit(employeesPath + "contracts/list/calendar", selectedDate, selectedView).then(onSuccess(state, "Contract", "Contract Expiry", {
        onProcessDate: ({contract_details}) => {
            let expiry_date, isTrial;
            if (contract_details) {
                const {end_date, end_of_trial_period} = contract_details;
                if (end_date) {
                    expiry_date = end_date;
                } else if (end_of_trial_period) {
                    expiry_date = end_of_trial_period;
                    isTrial = true;
                }
            }
            return expiry_date;
        }
    })).catch(onFailure(state));
};

const competencies = (state, selectedDate, selectedView) => {
    workers.emit(employeesPath + "competencies/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "Competency", "Competency Expiry", {titleKey: 'competency_type'})).catch(onFailure(state));
};

const medicals = (state, selectedDate, selectedView) => {
    workers.emit(employeesPath + "medicals/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "Medical", "Medical Certificate Expiry")).catch(onFailure(state));
};

const warnings = (state, selectedDate, selectedView) => {
    workers.emit(employeesPath + "warnings/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "Warning", "Warning Expiry", {titleKey: 'type'})).catch(onFailure(state));
};

const load = (state, selectedDate, selectedView) => {
    state.list.clear();
    contracts(state, selectedDate, selectedView);
    competencies(state, selectedDate, selectedView);
    medicals(state, selectedDate, selectedView);
    warnings(state, selectedDate, selectedView);
};

export default {load};