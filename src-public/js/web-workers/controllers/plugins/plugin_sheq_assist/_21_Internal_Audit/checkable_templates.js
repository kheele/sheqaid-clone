
(() => {
    class Controller extends AControllerAid {
        //name, desc, questions, contractor
        constructor(events) {
            super(events, {singular: "Internal Audit Form", plural: "Internal Audit Forms"}, "plugin_sheq_assist/21_Internal_Audit/forms/", "plugin_sheq_assist_21_Internal_Audit_forms");

            this.filter = this.filter.bind(this);
            this.by_logged_user_new = this.by_logged_user_new.bind(this);
            this.by_logged_user_replied = this.by_logged_user_replied.bind(this);

            const {addAction, filter, by_logged_user_new, by_logged_user_replied} = this;

            addAction("list/filter", filter);
            addAction("list/by_logged_user/new", by_logged_user_new);
            addAction("list/by_logged_user/replied", by_logged_user_replied);

            this.setQueryWhere(company_id => {
                return ['ALL'];
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
//                            notified_list: [{id, fname, lname, email}],//people
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
//                            notified_list: [{id, fname, lname, email}],//people
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
		
        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.list.call(this, evt);
                
                //list = await Promise.all(list.map(mapResults));

                /*const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;

                if (my_client) {
                    list = list.filter(val => {
                        return my_client.id === getClientId(val);
                    });
                } else if (client_id) {
                    list = list.filter(val => {
                        return client_id === getClientId(val);
                    });
                }

                if (my_project) {
                    list = list.filter(val => {
                        const {data, data: {project}} = val;
                        return my_project.id === getProjectId(project, data);
                    });
                } else if (project_id) {
                    list = list.filter(val => {
                        const {data, data: {project}} = val;
                        return project_id === getProjectId(project, data);
                    });
                }

                if (my_site) {
                    list = list.filter(val => {
                        const {data, data: {site}} = val;
                        return my_site.id === getSiteId(site, data);
                    });
                } else if (site_id) {
                    list = list.filter(val => {
                        const {data, data: {site}} = val;
                        return site_id === getSiteId(site, data);
                    });
                }*/

                return list;
            });
        }
        // </editor-fold>

        async by_logged_user_new(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const q = [
                    {key: 'contractor.id', comp: '=', val: loggedUser.user.id}
                ];
                return this.filter_impl(evt, q);
            });
        }

        async by_logged_user_replied(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const q = [
                    {key: 'contractor.id', comp: '=', val: loggedUser.user.id}
                ];
                return this.filter_impl(evt, q);
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

    new Controller(events);
})();