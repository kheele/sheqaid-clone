
(() => {
    class Controller extends AControllerAssist {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, questions, contractor
        constructor(events, db) {
            super(events, db, {singular: "Contractor Questionnaire", plural: "Contractors Questionnaires"}, "plugin_sheq_assist/contractors/questionnaires/", "plugin_sheq_assist_contractors_docs");

            const {addAction} = this;

            addAction("active/remove", this.remove.bind(this));
            addAction("complete/remove", this.remove.bind(this));

            addAction("update-status", this.update_status.bind(this));

            addAction("answer", this.answer.bind(this));//Deprecated: it might not be used anymore
            addAction("answer/ques", this.answer_ques.bind(this));

            addAction("active/list", this.list_active.bind(this));
            addAction("complete/list", this.list_complete.bind(this));
            addAction("active/list/filter", this.list_active_filter.bind(this));
            addAction("complete/list/filter", this.list_complete_filter.bind(this));

//            addAction("list/filter", filter);
            addAction("list/by_logged_user/new", this.by_logged_user_new.bind(this));
            addAction("list/by_logged_user/replied", this.by_logged_user_replied.bind(this));

            this.setQueryWhere(company_id => {
                const loggedUser = self.session.getLoggedUser();
                let {user: {data: {contractor_id}}, company: {id}, contractor_id: logged_contractor_id} = loggedUser;
                contractor_id = logged_contractor_id || contractor_id;

                const list = [
                    ['company_id', '==', company_id],
                    ['contractor.id', '==', contractor_id]
                ];
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
//            data = {
//                contractor: {id, name, username},
//                form: {
//                    name, desc, type,
//                    title_page_list: [
//                        {
//                            answer: null,
//                            isMandatory: false,
//                            maxScore: null,
//                            notifiedList: [{id, fname, lname, email}], //people
//                            notify: false,
//                            notifyAction: null, //answer
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
//                            notifiedList: [{id, fname, lname, email}], //people
//                            notify: false,
//                            notifyAction: null, //answer
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
                    contractor: {id, name: contractorName, username},
                    form, form: {name: formName, desc, type, title_page_list, questions}
                } = data;
                if (!!title_page_list && title_page_list.anyMatch(v => !!v.questionImage)) {
                    delete form.title_page_list;
                }
                if (!!questions && questions.anyMatch(v => !!v.questionImage)) {
                    delete form.questions;
                }

                data.status = "New";
                const doc_ref = await this.getDB().collection(this.tbl).add(data);
                let doc_snapshot = await doc_ref.get();

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

                const opts = {
                    from: '"SHEQ Assist" <support@sheqsolve.com>',
                    to: username,
                    subject: contractorName + ' Document From SHEQ Assist',
                    html: '<h3><b>Dear ' + contractorName + '</b></h3>\n\
                                <p>You have been sent ' + formName + ' questions to answer.</p>\n\
                                <hr />\n\
                                <p>Title: <b>' + formName + '</b></p>\n\
                                <p>Questions Description: <b>' + desc + '</b></p>\n\
                                <p>No. Of Questions: <b>' + questions.length + '</b></p>\n\
                                <hr />\n\
                                <p>You will be required to use SHEQ Assist application to answer the questions</p>\n\
                                <hr />\n\
                                <p>Kind Regards<br/>SHEQ Assist</p>'
                };

                const sendEmail = functions.httpsCallable('callables-sendEmail');
                const mailRes = await sendEmail(opts);
                console.log('mailRes', mailRes)

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return auditData;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update_status">
        async update_status(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();
                if (!doc_snapshot.exists) {
                    return null;
                }

                const old_data = doc_snapshot.data();
                const {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                await doc_ref.set(updateAttrs, {merge: true});//Promise < void >

                const {
                    contractor: {name: contractorName, username},
                    form: {name: formName, desc, type, title_page_list, questions}
                } = old_data;

                let status;
                switch (updateAttrs.status) {
                    case "Seen":
//                        skip this status. no email notification sent;
                        break;
                    case "CompleteRequested":
//                        status = "requested";
                        //TODO: send email to company
                        break;
                    case "CompleteAccepted":
                        status = "accepted";
                        break;
                    case "CompleteDeclined":
                        status = "declined";
                        break;
                }

                if (status) {
                    const opts = {
                        from: '"SHEQ Assist" <support@sheqsolve.com>',
                        to: username,
                        subject: contractorName + ' Document From SHEQ Assist',
                        html: '<h3><b>Dear ' + contractorName + '</b></h3>\n\
                                <p>Please note that the ' + formName + ' questionnaire completion has been <b>' + status + '</b>.</p>\n\
                                <hr />\n\
                                <p>Title: <b>' + formName + '</b></p>\n\
                                <p>Questions Description: <b>' + desc + '</b></p>\n\
                                <p>No. Of Questions: <b>' + questions.length + '</b></p>\n\
                                <hr />\n\
                                <p>Kind Regards<br/>SHEQ Assist</p>'
                    };

                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)
                }

                const auditData = {id: doc_snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

                return true;
            });
        }
        // </editor-fold>

        //Deprecated: it might not be used anymore
        // <editor-fold defaultstate="collapsed" desc="answer">
        async answer(evt, id, form) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
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
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="answer_ques">
        async answer_ques(evt, id, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {access_type} = loggedUser;

                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();
                if (!doc_snapshot.exists) {
                    return null;
                }

                const form = doc_snapshot.get('form');

                let {parentId, ques, idx, newMsg} = data;
                if (access_type === "User") {
                    newMsg.logged_user_id = loggedUser.user.id;
                }

                const isFile = () => {
                    return !!ques.answer && (ques.questionType === 'Photo' || ques.questionType === 'Document');
                };

                const upload = async (path, q, idx) => {
                    if (!!q.answer && (q.questionType === 'Photo' || q.questionType === 'Document')) {
                        let answers;
                        if (!isArray(q.answer)) {
                            answers = [q.answer];
                        } else {
                            answers = q.answer;
                        }
                        q.answer = await Promise.all(answers.map(async (answer, n) => {
                            if(answer.dlUrls) return answer;
                            
                            return await files.upload.call(this, answer, async (bucketFile) => {
                                let new_name = this.tbl + '/' + doc_snapshot.id + '/' + path + '-' + idx + '-' + n + '/';
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
                        }));
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

                doc_ref.set({form}, {merge: true});//Promise < void >

                console.log({parentId, ques, idx, newMsg})

                if (newMsg) {
                    const {sender: {uid}, msg, date} = newMsg;
                    const contractor = doc_snapshot.get('contractor');//id, name, username

                    const isLoggedContractor = access_type === "Contractor";

                    const getLoggedUser = async uid => {
                        const users_cntr = await Events.get('users/');
                        return users_cntr.find_by_id.call(users_cntr, null, uid);
                    };

                    let sentByName;
                    if (isLoggedContractor) {
                        const {name, username} = contractor;
                        sentByName = name + " (" + username + ")";
                    } else {
                        const {id, data: {fname, lname, username}} = await getLoggedUser(uid);
                        sentByName = fname + " " + lname + " (" + username + ")";
                    }

                    let sentToName, sentToEmail;
                    if (isLoggedContractor) {
                        const user_id = doc_snapshot.get('user_id');
                        const {id, data: {fname, lname, username}} = await getLoggedUser(user_id);
                        sentToName = fname + " " + lname;
                        sentToEmail = username;
                    } else {
                        const {name, username} = contractor;
                        sentToName = name;
                        sentToEmail = username;
                    }

                    const opts = {
                        from: '"SHEQ Assist" <support@sheqsolve.com>',
                        to: sentToEmail,
                        subject: 'Questionnnaire Chat Message',
                        html: '<h3><b>Dear ' + sentToName + '</b></h3>\n\
                            <p>You have been sent the following message on the questionnaire:</p>\n\
                            <p>Sent By: <b>' + sentByName + '</b></p>\n\
                            <p>Date Sent: <b>' + Dates.formatDate(date) + '</b></p>\n\
                            <p>Question: <b>' + ques.questionText + '</b></p>\n\
                            <p>Message Details: <b>' + msg + '</b></p>\n\
                            <p>Kind Regards<br/>SHEQ Assist</p>'
                    };

                    console.log('callables-sendEmail', opts)
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)
                }

                return {parentId, ques, idx};
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="by_logged_user_new">
        async by_logged_user_new(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const q = [
                    {key: 'contractor.id', comp: '=', val: loggedUser.user.id},
                    {key: 'contractor.id', comp: '=', val: loggedUser.user.id}
                ];
                return this.filter_impl(evt, q);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="by_logged_user_replied">
        async by_logged_user_replied(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const q = [
                    {key: 'contractor.id', comp: '=', val: loggedUser.user.id},
                    {key: 'contractor.id', comp: '=', val: loggedUser.user.id}
                ];
                return this.filter_impl(evt, q);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.list.call(this, evt);
                console.log(evt, list.length, loggedUser)
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_active">
        async list_active(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.list.call(this, evt);
                list = list.filter(({data}) => data.status !== "CompleteAccepted");
                console.log(evt, list.length, loggedUser)
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_complete">
        async list_complete(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.list.call(this, evt);
                list = list.filter(({data}) => data.status === "CompleteAccepted");
                console.log(evt, list.length, loggedUser)
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_active_filter">
        async list_active_filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name, status} = search_val;
                const q = [
                    {key: 'form.name', comp: 'LIKE', val: name},
                    {key: 'status', comp: '=', val: status}
                ];
                return this.filter_impl(evt, q, this.list_active(evt));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_complete_filter">
        async list_complete_filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name} = search_val;
                const q = [
                    {key: 'form.name', comp: 'LIKE', val: name}
                ];
                return this.filter_impl(evt, q, this.list_complete(evt));
            });
        }
        // </editor-fold>

        sortBy() {
            return "data.form.name";
        }
    }

    new Controller(events, db);
})();