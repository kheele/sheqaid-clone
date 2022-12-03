
(() => {
    class Controller extends AControllerAssist {
        //name, desc, questions, contractor
        constructor(events, db) {
            super(events, db, {singular: "Internal Audit Form", plural: "Internal Audit Forms"}, "plugin_sheq_assist/21_Internal_Audit/forms/", "plugin_sheq_assist_21_Internal_Audit_forms");

            this.filter = this.filter.bind(this);
            this.by_logged_user_new = this.by_logged_user_new.bind(this);
            this.by_logged_user_replied = this.by_logged_user_replied.bind(this);

            const {addAction, filter, by_logged_user_new, by_logged_user_replied} = this;

            addAction("list/filter", filter);
            addAction("list/by_logged_user/new", by_logged_user_new);
            addAction("list/by_logged_user/replied", by_logged_user_replied);

            this.setQueryWhere(company_id => {
                return [];
            });
        }

        async create(evt, data) {
//            data = {
//                form: {
//                    name, desc, type,
//                    title_page_list: [
//                        {
//                            answer: null,
//                            isMandatory: false,
//                            maxScore: null,
//                            notifiedList: [{id, fname, lname, email}],//people
//                            notify: false,
//                            notifyAction: null,//answer
//                            open: false,
//                            questionImage: null,
//                            questionText: "Prepared By",
//                            questionType: "Short Answer"
//                        }
//                    ],
//                    questions: [
//                        {
//                            answer: null,
//                            isMandatory: false,
//                            maxScore: null,
//                            notifiedList: [{id, fname, lname, email}],//people
//                            notify: false,
//                            notifyAction: null,//answer
//                            open: false,
//                            questionImage: null,
//                            questionText: "Prepared By",
//                            questionType: "Short Answer"
//                        }
//                    ]
//                }
//            };
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);
                let {
                    form, form: {name, desc, type, title_page_list, questions}
                } = data;
                if (!!title_page_list && title_page_list.anyMatch(v => !!v.questionImage)) {
                    delete form.title_page_list;
                }
                if (!!questions && questions.anyMatch(v => !!v.questionImage)) {
                    delete form.questions;
                }

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                const upload = (list, path) => {
                    return Promise.all(list.map(async (q, n) => {
                        if (!q.questionImage)
                            return q;

                        const gcsUri = await files.upload.call(this, q.questionImage, async function (bucketFile) {
                            const new_name = this.tbl + '/' + doc_snapshot.id + '/' + path + '-' + n + '/' + bucketFile.name;
                            return new_name;
                        }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                            throw e;
                        });
                        q.questionImage = gcsUri;
                        return q;
                    }));
                };

                let uploaded = false;
                if (!form.title_page_list && !!title_page_list) {
                    title_page_list = await upload(title_page_list, 'title_page_list');
                    uploaded = true;
                }
                if (!form.questions && !!questions) {
                    questions = await upload(questions, 'questions');
                    uploaded = true;
                }
                if (uploaded) {
                    await doc_ref.set({form: {title_page_list, questions}}, {merge: true});//Promise < void >
                }

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return auditData;
            });
        }

        async by_logged_user_new(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const q = [
                    {key: 'contractor.id', comp: '=', val: loggedUser.user.id},
                    {key: 'contractor.id', comp: '=', val: loggedUser.user.id}
                ];
                return this.filter_impl(evt, q);
            });
        }

        async by_logged_user_replied(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const q = [
                    {key: 'contractor.id', comp: '=', val: loggedUser.user.id},
                    {key: 'contractor.id', comp: '=', val: loggedUser.user.id}
                ];
                return this.filter_impl(evt, q);
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