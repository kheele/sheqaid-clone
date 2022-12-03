
(() => {
    class Controller extends AControllerAssist {
        //name, desc, questions, contractor
        constructor(events, db) {
            super(events, db, {singular: "Template Schedule", plural: "Template Schedules"}, "plugin_sheq_assist/21_Internal_Audit/templates/schedules/", "21_Internal_Audit_checkable_templates_schedules");

            const {addAction} = this;

            addAction("list/filter", this.filter.bind(this));
        }

        getDB() {
            return db2;
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);

                //{
                //template_id, interval, item_id, status,
                //next_date{
                //  split{year, month, date, day},
                //  date,
                //  status
                //},
                //prev_date{
                //  date_history_year[]
                //  date_history_month[]
                //  date_history_date[]
                //  date_history_day[]
                //  date_history[]
                //  status_history[""]
                //},
                //prev_list[{status, date, date_split, list[]}]
                //}

                let {employee_id, interval, start_date, template_id} = data;
                delete data.start_date;
                
                const currD = Dates.parse(start_date).setMidnight();

                const next_date = {};
                next_date.split = {
                    year: currD.getFullYear(),
                    month: currD.getMonth(),
                    date: currD.getDate(),
                    day: currD.getDay()
                };
                next_date.date = currD.getTime();
                next_date.status = "Scheduled";
                data.next_date = next_date;
                data.status = "Scheduled";

                const employee_ref = await this.getDB().collection("plugin_sheq_assist_employees").doc(employee_id);//Promise < DocumentReference < T > >
                data.employee_ref = employee_ref;

                const template_ref = await this.getDB().collection("plugin_sheq_assist_21_Internal_Audit_forms").doc(template_id);//Promise < DocumentReference < T > >
                data.template_ref = template_ref;

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                data.employee = await find_by_id(null, employee_id);
                data.template = await find_by_id(null, template_id);

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);
                console.log('here')

                const {email, fname, lname} = data.employee.data;
                if (email) {
                    const opts = {
                        from: '"SHEQ Assist" <support@sheqsolve.com>',
                        to: email,
                        subject: 'SHEQ Assist Application Link',
                        html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
                                <p>You have a scheduled inspection with the following details:</p>\n\
                                <p>Interval: <b>' + interval + '</b></p>\n\
                                <p>Start Date: <b>' + Dates.formatDate(currD) + '</b></p>\n\
                                <p>Kind Regards<br/>SHEQ Assist</p>'
                    };
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)
                }

                return auditData;
            });
        }

        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                const list = await this.loadOnSnapshot(evt, (val, changeType) => {
                    if (this.onChange) {
                        this.onChange(val, changeType);
                    }
//                if (this.currList.find(_val => _val.id === val.id)) {
//                    if (changeType === 'added') {
////                        Events.emit(this.root + 'onCreated', val);
//                    } else if (changeType === 'modified') {
////                        Events.emit(this.root + 'onUpdated', val);
//                    } else if (changeType === 'removed') {
////                        Events.emit(this.root + 'onRemoved', val);
//                    }
//                }
                });
                return list;
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name, type} = search_val;
                const q = [
                    {key: 'form.name', comp: 'LIKE', val: name},
                    {key: 'form.type', comp: '=', val: type}
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    new Controller(events, db);
})();