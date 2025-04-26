
const onSuccess = (state, key, displayTitle) => {
    return res => {
        state.list.push(...res.map(item => {
            const {id, data: {created_at, type, desc, responsible_department, responsible_person, expiry, company, title, doc_num, doc, user_id}} = item;
            return {
                start: new Date(expiry),
                end: new Date(expiry),
                title: displayTitle + " Review Date (" + title + ')',
                displayTitle,
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

const COVID_Management_documents = (state, selectedDate, selectedView) => {
    workers.emit("plugin_sheq_assist/COVID_Management/documents/list/calendar", selectedDate, selectedView).
            then(onSuccess(state, "COVID_Management_Document", "COVID Management Document")).catch(onFailure(state));
};

const load = (state, selectedDate, selectedView) => {
    state.list.clear();
    COVID_Management_documents(state, selectedDate, selectedView);
};

export default {load};