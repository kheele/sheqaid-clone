const employeesPath = 'plugin_sheq_assist/StructureAndResponsibility/';

const appointments = (state, selectedDate, selectedView) => {
    workers.emit(employeesPath + "appointments/list/calendar", selectedDate, selectedView).then(res => {
        state.list.push(...res.map(item => {
            const {id, data: {created_at, start_date, expiry_date, title, participants}} = item;
            return {
                start: new Date(expiry_date),
                end: new Date(expiry_date),
                title: "Job Appointment (" + title + ')',
                item,
                key: 'JobAppointment'
            };
        }));
        state.dataError = false;
        state.dataLoaded = true;
    }).catch(e => {
        console.log(e);
        state.dataError = true;
        state.dataLoaded = true;
    });
};

const load = (state, selectedDate, selectedView) => {
    state.list.clear();
    appointments(state, selectedDate, selectedView);
};

export default {load};