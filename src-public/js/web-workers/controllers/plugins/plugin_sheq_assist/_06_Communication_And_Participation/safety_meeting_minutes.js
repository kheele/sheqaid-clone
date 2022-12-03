
(() => {
    class Controller extends AControllerAid {
        //meeting_id, type, document
        constructor(events, db) {
            super(events, db, {singular: "Safety Meeting Minutes", plural: "Safety Meeting Minutes"}, "plugin_sheq_assist/06_Communication_And_Participation/safety-meeting/minutes/", "plugin_sheq_assist_calendar_minutes");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);
        }

        async create(evt, data) {
            return this.createAndUploadHasFile(evt, data, "doc", data => {
                data.type = data.doc.endsWith('.pdf') ? "Document" : "Video";
            });
        }

        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {doc}}) => {
                doc && await files.remove(doc);
            });
        }

        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAid.prototype.list.call(this, evt);
                list = list.filter(val => {
                    const {meeting} = val.data;
                    return meeting && meeting.meeting_type === 'Safety';
                });

                console.log(this.tbl, 'list filtered', list.length)
                return list;
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {date, title, participants} = search_val;
                //title, meeting_type, start, end, notes, doc, participants
                const q = [
                    {key: 'meeting.title', comp: 'LIKE', val: title},
                    [
                        {key: 'inArray(meeting.participants.fname)', comp: 'LIKE', val: participants},
                        {key: 'inArray(meeting.participants.lname)', comp: 'LIKE', val: participants}
                    ],
                    {key: 'meeting.date', comp: '=', val: date}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();