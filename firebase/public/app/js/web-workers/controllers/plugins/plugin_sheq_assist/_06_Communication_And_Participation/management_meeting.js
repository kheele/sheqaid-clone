
(() => {
    class Controller extends AControllerAssist {
        //title, start, end, allDay, participants
        constructor(events, db) {
            super(events, db, {singular: "Management Meeting", plural: "Management Meetings"}, "plugin_sheq_assist/06_Communication_And_Participation/management-meeting/");

            const {addAction} = this;
            
            addAction("list/calendar", this.listByCalendar.bind(this));
            addAction("list/filter", this.filter.bind(this));
        }

        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = listImpl(evt, loggedUser);
                console.log(this.tbl, 'list filtered', list.length)
                return list;
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {date, title, participants} = search_val;
                //title, meeting_type, start, end, notes, doc, participants
                const q = [
                    {key: 'title', comp: 'LIKE', val: title},
                    [
                        {key: 'inArray(participants.fname)', comp: 'LIKE', val: participants},
                        {key: 'inArray(participants.lname)', comp: 'LIKE', val: participants}
                    ],
                    {key: 'date', comp: '=', val: date}
                ];
                return this.filter_impl(evt, q);
            });
        }

        async listByCalendar(evt, date, view) {
            const calendar = await Events.get('plugin_sheq_assist/calendar/');
            return calendar.listByCalendarMeetings(evt, date, view, [{key: 'meeting_type', value: 'Management'}]);
        }
    }

    async function listImpl(evt, loggedUser) {
        const calendar = await Events.get('plugin_sheq_assist/calendar/');
        let list = await calendar.list(evt);
        list = list.filter(val => {
            const {calendar_type, meeting_type} = val.data;
            return calendar_type === 'Meeting' && meeting_type === 'Management';
        });
        return list;
    }

    new Controller(events, db);
})();