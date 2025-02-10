
const onSuccess = (state, key) => {
    return res => {
        state.list.push(...res.map(item => {
            const {id, data: {created_at, desc, category, person_assigned, start, end}} = item;
            return {
                start: new Date(end),
                end: new Date(end),
                title: "Task (" + category + ") assigned to " + (person_assigned.lname + ' ' + person_assigned.fname),
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

const tasks = (state, selectedDate, selectedView) => {
    neonBinding.events.emit("plugin_sheq_assist/calendar/tasks/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "Employee_Task")).catch(onFailure(state));
};

const load = (state, selectedDate, selectedView) => {
    state.list.clear();
    tasks(state, selectedDate, selectedView);
};

export default {load};