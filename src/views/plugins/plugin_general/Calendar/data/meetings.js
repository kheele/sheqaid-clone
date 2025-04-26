const mainPath = 'plugin_sheq_assist/06_Communication_And_Participation/';

const onSuccess = (state, key) => {
    return res => {
        state.list.push(...res.map(item => {
            const {id, data: {created_at, title, start, end}} = item;
            return {
                start: new Date(end),
                end: new Date(end),
                title: title + ' ' + key + ' Meeting',
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

const management = (state, selectedDate, selectedView) => {
    workers.emit(mainPath + "management-meeting/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "Management")).catch(onFailure(state));
};
const safety = (state, selectedDate, selectedView) => {
    workers.emit(mainPath + "safety-meeting/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "Safety")).catch(onFailure(state));
};
const general = (state, selectedDate, selectedView) => {
    workers.emit("plugin_sheq_assist/calendar/meetings/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "General")).catch(onFailure(state));
};

const load = (state, selectedDate, selectedView) => {
    state.list.clear();
    management(state, selectedDate, selectedView);
    safety(state, selectedDate, selectedView);
    general(state, selectedDate, selectedView);
};

export default {load};