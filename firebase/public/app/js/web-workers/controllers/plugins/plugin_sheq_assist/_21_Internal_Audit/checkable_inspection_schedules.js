
(() => {
    class Controller extends AInternalAuditCheckablesController {
        //title, type, document
        constructor(events, db) {
            super(events, db, {singular: "Inspection Schedule", plural: "Inspection Schedules"}, "plugin_sheq_assist/21_Internal_Audit/inspection/", "21_Internal_Audit_inspection_schedules");
        }

        getDB() {
            return db2;
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);
                
                const {
                    template, template: {name, desc, type, title_page_list, questions}
                } = data;//template, client, project, site, template{name, desc, type, questions,title_page_list}
                if (!!title_page_list && title_page_list.anyMatch(v => !!v.questionImage || (!!v.answer && v.questionType === 'Photo'))) {
                    delete template.title_page_list;
                }
                if (!!questions && questions.anyMatch(v => !!v.questionImage || (!!v.answer && v.questionType === 'Photo'))) {
                    delete template.questions;
                }

                const doc_ref = await this.getDB().collection(this.tbl).set(data, {merge: true});//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;

                const upload = (list, path) => {
                    return Promise.all(list.map(async (q, n) => {
                        if (!!q.questionImage || (!!q.answer && q.questionType === 'Photo')) {
                            const uploads = [];
                            if (!!q.questionImage) {
                                uploads.push('questionImage');
                            }
                            if (!!q.answer && q.questionType === 'Photo') {
                                uploads.push('answer');
                            }

                            await Promise.all(uploads.map(async (key, n) => {
                                const gcsUri = await files.upload.call(this, q[key], async function (bucketFile) {
                                    let new_name = this.tbl + '/' + doc_snapshot.id + '/' + path + '-' + n + '/';
                                    if (key === 'answer') {
                                        new_name += 'answers/';
                                    }
                                    return new_name + bucketFile.name;
                                }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                                    throw e;
                                });
                                q[key] = gcsUri;
                            }));
                        }
                        return q;
                    }));
                };

                let uploaded = false;
                if (!template.title_page_list && !!title_page_list) {
                    title_page_list = await upload(title_page_list, 'title_page_list');
                    uploaded = true;
                }
                if (!template.questions && !!questions) {
                    questions = await upload(questions, 'questions');
                    uploaded = true;
                }
                if (uploaded) {
                    await doc_ref.set({template: {title_page_list, questions}}, {merge: true});//Promise < void >
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
    }

    new Controller(events, db);
})();