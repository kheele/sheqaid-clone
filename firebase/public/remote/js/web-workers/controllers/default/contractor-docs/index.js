
(() => {
    class Controller extends AController {
        //fname, lname, id_num, passport_num
        constructor(events, db) {
            super(events, db, {singular: "Contractor Document", plural: "Contractor Documents"}, "default/contractor-docs/", "plugin_sheq_assist_contractors_docs");

            const {addAction} = this;

            addAction("answer", this.answer.bind(this));
            addAction("answer/ques", this.answer_ques.bind(this));
//            addAction("list/filter", this.filter.bind(this));
        }

        async answer(evt, id, form) {
            return db.whenLoggedIn(async loggedUser => {
                const doc_ref = await db.collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();
                if (!doc_snapshot.exists) {
                    return null;
                }

                let {title_page_list, questions} = form;
                if (!!title_page_list && title_page_list.anyMatch(v => (!!v.answer && (v.questionType === 'Photo' || v.questionType === 'Document')))) {
                    delete form.title_page_list;
                }
                if (!!questions && questions.anyMatch(v => (!!v.answer && (v.questionType === 'Photo' || v.questionType === 'Document')))) {
                    delete form.questions;
                }

                const upload = (list, path) => {
                    return Promise.all(list.map(async (q, n) => {
                        if (!!q.answer && (q.questionType === 'Photo' || q.questionType === 'Document')) {
                            const gcsUri = await files.upload.call(this, q.answer, async (bucketFile) => {
                                let new_name = this.tbl + '/' + doc_snapshot.id + '/' + path + '-' + n + '/';
                                if (q.questionType === 'Document') {
                                    new_name += 'answers-doc/';
                                } else if (q.questionType === 'Photo') {
                                    new_name += 'answers-photo/';
                                }
                                return new_name + bucketFile.name;
                            }).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                                    throw e;
                            });
                            q.answer = gcsUri;
                        }
                        return q;
                    }));
                };

                if (!form.title_page_list && !!title_page_list) {
                    title_page_list = await upload(title_page_list, 'title_page_list');
                }
                if (!form.questions && !!questions) {
                    questions = await upload(questions, 'questions');
                }

                await doc_ref.set({answered: true, form: {title_page_list, questions}}, {merge: true});//Promise < void >

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                form = doc_snapshot.get('form');
                title_page_list = form.title_page_list;
                questions = form.questions;
                return {title_page_list, questions};
            });
        }

        async answer_ques(evt, id, data) {
            return db.whenLoggedIn(async loggedUser => {
                const doc_ref = await db.collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();
                if (!doc_snapshot.exists) {
                    return null;
                }

                const form = doc_snapshot.get('form');

                let {parentId, ques, idx} = data;
                
                const isFile = () => {
                    return !!ques.answer && (ques.questionType === 'Photo' || ques.questionType === 'Document');
                };

                const upload = async (path, q, idx) => {
                    if (!!q.answer && (q.questionType === 'Photo' || q.questionType === 'Document')) {
                        const gcsUri = await files.upload.call(this, q.answer, async (bucketFile) => {
                            let new_name = this.tbl + '/' + doc_snapshot.id + '/' + path + '-' + idx + '/';
                            if (q.questionType === 'Document') {
                                new_name += 'answers-doc/';
                            } else if (q.questionType === 'Photo') {
                                new_name += 'answers-photo/';
                            }
                            return new_name + bucketFile.name;
                        }).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                                    throw e;
                        });
                        q.answer = gcsUri;
                    }
                    return q;
                };

                if (parentId === 'TitlePage') {
                    if (isFile()) {
                        ques = await upload('title_page_list', ques, idx);
                    }
                    form.title_page_list[idx] = ques;
                } else if (parentId === 'Questions') {
                    if (isFile()) {
                        ques = await upload('questions', ques, idx);
                    }
                    form.questions[idx] = ques;
                }

                await doc_ref.set({status: "Unanswered", form}, {merge: true});//Promise < void >
                
                console.log({parentId, ques, idx})

                return {parentId, ques, idx};
            });
        }

        async list(evt) {
            return db.whenLoggedIn(async loggedUser => {
                const now = new Date().getTime();
                console.log('loggedUser', loggedUser);
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    return q.where('email', '==', loggedUser.email);
                });
                return list;
            });
        }

        sortBy() {
            return 'form.name';
        }

    }

    new Controller(events, db);
})();