(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, questions, contractor
        constructor(events, db) {
            super(events, db, {
                singular: "Contractor Questionnaire Library",
                plural: "Contractor Questionnaire Libraries"
            }, "plugin_sheq_assist/contractors/questionnaires/library/", "plugin_sheq_assist_contractors_questionnaire_library");

            const {addAction} = this;

            addAction("list/filter", this.filter.bind(this));

            this.setQueryWhere(company_id => {
                return ['ALL'];
            });
        }

        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            /*            data = {
             //                visibility,  
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
             //            };*/
            return Events.whenLoggedIn(async loggedUser => {
                let {user: {data: {client: my_client}}, client_id} = loggedUser;

                this.injectSavable(evt, loggedUser, data);
                let {
                    visibility,
                    form, form: {name, desc, type, title_page_list, questions}
                } = data;

                if (visibility === 'OnlyMyCompany') {
                    data.visibility = my_client ? my_client.id : client_id;
                }

                if (QuestionnaireFuns.hasQuestionFile(title_page_list)) {
                    delete form.title_page_list;
                }
                if (QuestionnaireFuns.hasQuestionFile(questions)) {
                    delete form.questions;
                }

                data.keywords = this.generateKeywords([name]);
                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                let uploaded = false;
                if (!form.title_page_list && !!title_page_list) {
                    title_page_list = await QuestionnaireFuns.uploadQuestionFile.call(this, doc_snapshot.id, title_page_list, 'title_page_list');
                    uploaded = true;
                }
                if (!form.questions && !!questions) {
                    questions = await QuestionnaireFuns.uploadQuestionFile.call(this, doc_snapshot.id, questions, 'questions');
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

                if (auditData.data.visibility !== 'EveryCompany') {
                    auditData.data.visibility = 'OnlyMyCompany';
                }
                return await ContractorQuestionnaireFuns.mapQuestionnaireResults(auditData);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                let {user: {data: {client: my_client}}, client_id} = loggedUser;

                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }
                const {visibility, form = {}} = updateAttrs;
                let {name, desc, type, title_page_list, questions} = form;

                if (name) {
                    updateAttrs.keywords = this.generateKeywords([name]);
                }

                if (visibility === 'OnlyMyCompany') {
                    updateAttrs.visibility = my_client ? my_client.id : client_id;
                }

                console.log('QuestionnaireFuns.hasQuestionFile', QuestionnaireFuns.hasQuestionFile(questions))
                if (QuestionnaireFuns.hasQuestionFile(title_page_list)) {
                    delete updateAttrs.form.title_page_list;
                }
                if (QuestionnaireFuns.hasQuestionFile(questions)) {
                    delete updateAttrs.form.questions;
                }

                let uploaded = false;
                if (updateAttrs.form) {
                    if (!updateAttrs.form.title_page_list && !!title_page_list) {
                        title_page_list = await QuestionnaireFuns.uploadQuestionFile.call(this, snapshot.id, title_page_list, 'title_page_list');
                        uploaded = true;
                    }
                    if (!updateAttrs.form.questions && !!questions) {
                        questions = await QuestionnaireFuns.uploadQuestionFile.call(this, snapshot.id, questions, 'questions');
                        uploaded = true;
                    }
                }
                if (uploaded) {
                    updateAttrs.form.title_page_list = title_page_list;
                    updateAttrs.form.questions = questions;
                }

                const updateData = await AControllerAid.prototype.update.call(this, evt, id, updateAttrs);

                if (updateData && updateData.visibility !== 'EveryCompany') {
                    updateData.visibility = 'OnlyMyCompany';
                }

                return (await ContractorQuestionnaireFuns.mapQuestionnaireResults({id, data: updateData})).data;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const item = await ContractorQuestionnaireFuns.mapQuestionnaireResults({
                    id: doc_snapshot.id,
                    data: doc_snapshot.data()
                });
                if (item.data.visibility !== 'EveryCompany') {
                    item.data.visibility = 'OnlyMyCompany';
                }
                return item;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let {company, user: {data: {client: my_client}}, client_id} = loggedUser;
                if(company.data.consultant) {
                    client_id = my_client ? my_client.id : client_id;
                } else {
                    client_id = company.id;
                }
                if (!client_id) {
                    return [];
                }
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                    q = q.where('visibility', 'in', ['EveryCompany', client_id]);
                    return q;
                });

                console.log(evt, list.length, loggedUser)
                list = await Promise.all(list.map(v => {
                    if (v.data.visibility !== 'EveryCompany') {
                        v.data.visibility = 'OnlyMyCompany';
                    }
                    return v;
                }).map(ContractorQuestionnaireFuns.mapQuestionnaireResults));
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                let {company, user: {data: {client: my_client}}, client_id} = loggedUser;
                if(company.data.consultant) {
                    client_id = my_client ? my_client.id : client_id;
                } else {
                    client_id = company.id;
                }
                if (!client_id) {
                    return [];
                }

                const {name = '', visibility, answered_by} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                    if (visibility) {
                        q = q.where('visibility', '==', visibility === 'EveryCompany' ? visibility : client_id);
                    } else {
                        q = q.where('visibility', 'in', ['EveryCompany', client_id]);
                    }
                    if (answered_by) {
                        q = q.where('answered_by', '==', answered_by);
                    }
                    q = q.where('keywords', 'array-contains', name);
                    return q;
                });

                list = await Promise.all(list.map(v => {
                    if (v.data.visibility !== 'EveryCompany') {
                        v.data.visibility = 'OnlyMyCompany';
                    }
                    return v;
                }).map(ContractorQuestionnaireFuns.mapQuestionnaireResults));
                console.log(evt, list.length, loggedUser)
                return list;
            });
        }

        // </editor-fold>

        sortBy() {
            return "form.name";
        }
    }

    new Controller(events, db);
})();