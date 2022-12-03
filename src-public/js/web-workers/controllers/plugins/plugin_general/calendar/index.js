
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor. Click on the + sign on the left to edit the code.">
        constructor(events, db) {
            super(events, db, {singular: "Calendar", plural: "Calendar"}, "plugin_sheq_assist/calendar/", "plugin_sheq_assist_calendar");

            const {addAction} = this;

            addAction("tasks/create", this.tasks_create.bind(this));
            addAction("tasks/dashboard/count", this.tasks_dashboard_count.bind(this));
            addAction("tasks/list", this.tasks_list.bind(this));
            addAction("tasks/list/calendar", this.listByCalendarTasks.bind(this));
            addAction("tasks/list/filter", this.tasks_filter.bind(this));

            addAction("meetings/create", this.meetings_create.bind(this));
            addAction("meetings/dashboard/count", this.meetings_dashboard_count.bind(this));
            addAction("meetings/list", this.meetings_list.bind(this));
            addAction("meetings/list/calendar", this.listByCalendarMeetings.bind(this));
            addAction("meetings/list/filter", this.meetings_filter.bind(this));

            addAction("minutes/create", this.minutes_create.bind(this));

            const fn = async () => {
                const doc_ref = await db.collection(this.tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await doc_ref.get();
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc);
                });
                console.log(`${this.tbl} test`);

                await Promise.all(list.map(async (doc) => {
                    const ref = this.getDB().collection(this.tbl).doc(doc.id);
                    const updated = await ref.set(doc.data(), {merge: true});//Promise < void >
                    console.log(`${this.tbl} done`, doc.id);
                }));
                console.log(`${this.tbl} final`);
            };
            //fn();
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create. Click on the + sign on the left to edit the code.">
        async tasks_create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);
                data.calendar_type = 'Task';

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >

                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                data = doc_snapshot.data();
                const {created_at} = data;
                if (created_at && created_at.toDate) {
                    data.created_at = created_at.toDate();
                }
                return {id: doc_snapshot.id, data};
            });
        }

        async meetings_create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);
                data.calendar_type = 'Meeting';

                const {doc} = data;
                if (doc) {
                    delete data.doc;
                }

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                let attachment;
                if (doc) {
                    const gcsUri = await files.upload.call(this, doc, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/meeting/' + bucketFile.name;
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    const updated = await doc_ref.update({doc: gcsUri});//Promise < void >
                    attachment = gcsUri.dlUrls[0];
                }

                if (data.participants) {//send emails
                    const emails = data.participants.filter(({id, fname, lname, email}) => !!email).map(({email}) => email);
                    const opts = {
                        from: '"SHEQ Aid" <support@sheqsolve.com>',
                        to: emails.join(","),
                        subject: 'SHEQ Aid, Meeting Invitation',
                        html: '<b>You have been invited to a meeting</b>'
                    };
                    attachment && (opts.attachments = [
                        {// use URL as an attachment
                            filename: 'Meeting.pdf',
                            path: attachment
                        }
                    ]);
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    await sendEmail(opts);
                }

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                data = doc_snapshot.data();
                const {created_at} = data;
                if (created_at && created_at.toDate) {
                    data.created_at = created_at.toDate();
                }
                return {id: doc_snapshot.id, data};
            });
        }

        async minutes_create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);

                const {type, doc} = data;
                if (type === 'Upload' && doc) {
                    delete data.doc;
                }

                const doc_ref = await this.getDB().collection('plugin_sheq_assist_calendar_minutes').add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (type === 'Upload' && doc) {
                    const gcsUri = await files.upload.call(this, doc, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/minutes/' + bucketFile.name;
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    const updated = await doc_ref.update({doc: gcsUri});//Promise < void >
                }

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                data = doc_snapshot.data();
                const {created_at} = data;
                if (created_at && created_at.toDate) {
                    data.created_at = created_at.toDate();
                }
                return {id: doc_snapshot.id, data};
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove. Click on the + sign on the left to edit the code.">
        async tasks_remove(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.tasks_list(evt);
                const item = list.find(v => v.id === id);
                if (!item)
                    return false;

                const {data: {doc}} = item;
                doc && await files.remove(doc);

                const res = await this.getDB().collection(this.tbl).doc(id).delete();
                //console.log(this.tbl, 'remove')
                return true;
            });
        }

        async meetings_remove(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.meetings_list(evt);
                const item = list.find(v => v.id === id);
                if (!item)
                    return false;

                const {data: {doc}} = item;
                doc && await files.remove(doc);

                const res = await this.getDB().collection(this.tbl).doc(id).delete();
                //console.log(this.tbl, 'remove')
                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="dashboard_count">
        async tasks_dashboard_count(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                return 0;
            });
        }
        
        async meetings_dashboard_count(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                return 0;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list. Click on the + sign on the left to edit the code.">
        async tasks_list(evt) {
            return this.filter_by(evt, null, search_val => {
                return val => {
                    const {calendar_type} = val.data;
                    return calendar_type === 'Task';
                };
            });
        }

        async meetings_list(evt) {
            return this.filter_by(evt, null, search_val => {
                return val => {
                    const {calendar_type} = val.data;
                    return calendar_type === 'Meeting';
                };
            });
        }

        async listByCalendarTasks(evt, date, view) {
            return this.listByCalendar(evt, date, view, {
                listByCalendarKey: 'end',
                filter: [{key: 'calendar_type', value: 'Task'}]
            });
        }

        async listByCalendarMeetings(evt, date, view, filter) {
            filter = filter || [{key: 'meeting_type', value: 'General'}];
            return this.listByCalendar(evt, date, view, {
                listByCalendarKey: 'end',
                filter: [{key: 'calendar_type', value: 'Meeting'}, ...filter]
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter. Click on the + sign on the left to edit the code.">
        async tasks_filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
//            const {person_assigned, assigned_by, category, type, date_range} = search_val;
                const q = [
//                {key: 'type', comp: '=', val: type},
//                {key: 'title', comp: 'LIKE', val: title}
                ];
                return this.filter_impl(evt, q);
            });
        }

        async meetings_filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
//            const {type, title} = search_val;
                const q = [
//                {key: 'type', comp: '=', val: type},
//                {key: 'title', comp: 'LIKE', val: title}
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

    }

    new Controller(events, db);
})();