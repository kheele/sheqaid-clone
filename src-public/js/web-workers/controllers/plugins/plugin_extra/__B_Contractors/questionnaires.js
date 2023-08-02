
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, questions, contractor
        constructor(events, db) {
            super(events, db, {singular: "Contractor Questionnaire", plural: "Contractors Questionnaires"}, "plugin_sheq_assist/contractors/questionnaires/", "plugin_sheq_assist_contractors_docs");

            const {addAction} = this;

            addAction("active/remove", this.remove.bind(this));
            addAction("complete/remove", this.remove.bind(this));

            addAction("update-status", this.update_status.bind(this));

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

                let {
                    user: {
                        data: {
                            client: my_client, project: my_project, site: my_site,
                            contractor_id
                        }
                    },
                    company: {id},
                    contractor_id: logged_contractor_id,
                    client_id, project_id, site_id
                } = loggedUser;

                contractor_id = logged_contractor_id || contractor_id;

                const list = [
                    ['company_id', '==', company_id]
                ];
                if (contractor_id) {
                    list.push(['contractor_id', '==', contractor_id]);
                }
                if (my_client) {
                    list.push(['client_id', '==', my_client.id]);
                } else if (client_id) {
                    list.push(['client_id', '==', client_id]);
                }

//                console.log('setQueryWhere', this.tbl, company_id, contractor_id, logged_contractor_id)
                return list;
            });
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            /*            data = {
             //                contractor: {id, name, username},
             //                form: {
             //                    name, desc, type,
             //                    title_page_list: [
             //                        {
             //                            answer: null,
             //                            isMandatory: false,
             //                            maxScore: null,
             //                            notified_list: [{id, fname, lname, email}], //people
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
             //                            notified_list: [{id, fname, lname, email}], //people
             //                            notify: false,
             //                            notifyAction: null, //answer
             //                            open: false,
             //                            questionImage: null,
             //                            questionText: "Prepared By",
             //                            questionType: "Short Answer"
             //                        }
             //                    ]
             //                }
             //            };*/
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);
                let {
                    user_id,
                    contractor: {id: contractor_id, name: contractorName, username},
                    form, form: {name: formName, desc, answered_by, type, title_page_list, questions}
                } = data;

                if (QuestionnaireFuns.hasQuestionFile(title_page_list)) {
                    delete form.title_page_list;
                }
                if (QuestionnaireFuns.hasQuestionFile(questions)) {
                    delete form.questions;
                }

                data.status = "New";
                const doc_ref = await this.getDB().collection(this.tbl).add(data);
                let doc_snapshot = await doc_ref.get();

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

                const ccList = await ContractorQuestionnaireFuns.getEmailCCReceipients.call(this, {
                    loggedUser, user_id, contractor_id, answered_by
                });

                let questionsArray = await Promise.all(Object.values(questions || {}).
                        map(QuestionnaireFuns.unmapQuestionnaires(null, true)));
                questionsArray = questionsArray.
                        map(v => v.questions || [v]).
                        reduce((a1, a2) => [...a1, ...a2], []).
                        filter(v => v.questionType !== 'NoAnswer');

                const companyName = await UserFuns.getUserCompanyName();

                const opts = {
                    from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                    to: username,
                    bcc: ccList,
                    subject: contractorName + ' Questionnaire From ' + companyName
                };

                if (answered_by === 'Sender') {
                    opts.html = '<h3><b>Good Day</b></h3>\n\
                                <p>' + contractorName + ' has been sent ' + formName + ' questionnaire for approval.</p>\n\
                                <hr />\n\
                                <p>Company: <b>' + companyName + '</b></p>\n\
                                <p>Title: <b>' + formName + '</b></p>\n\
                                <p>Questions Description: <b>' + desc + '</b></p>\n\
                                <p>Total No. Of Questions: <b>' + questionsArray.length + '</b></p>\n\
                                <p>No. Of Questions Required: <b>' + questionsArray.filter(v => !!v.isMandatory).length + '</b></p>\n\
                                <p>No. Of Questions Optional: <b>' + questionsArray.filter(v => !v.isMandatory).length + '</b></p>\n\
                                <hr />\n\
                                <p>You will be required to use SHEQ Aid application to approve the questionnaire</p>\n\
                                <hr />\n\
                                <p>Kind Regards<br/>SHEQ Aid</p>';
                } else {
                    opts.html = '<h3><b>Good Day</b></h3>\n\
                                <p>' + contractorName + ' has been sent ' + formName + ' questionnaire to answer.</p>\n\
                                <hr />\n\
                                <p>Company: <b>' + companyName + '</b></p>\n\
                                <p>Title: <b>' + formName + '</b></p>\n\
                                <p>Questions Description: <b>' + desc + '</b></p>\n\
                                <p>Total No. Of Questions: <b>' + questionsArray.length + '</b></p>\n\
                                <p>No. Of Questions Required: <b>' + questionsArray.filter(v => !!v.isMandatory).length + '</b></p>\n\
                                <p>No. Of Questions Optional: <b>' + questionsArray.filter(v => !v.isMandatory).length + '</b></p>\n\
                                <hr />\n\
                                <p>You will be required to use SHEQ Aid application to answer the questionnaire</p>\n\
                                <hr />\n\
                                <p>Kind Regards<br/>SHEQ Aid</p>';
                }

                await Utils.sendEmail(opts);

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return await ContractorQuestionnaireFuns.mapQuestionnaireResults(auditData);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update_status">
        async update_status(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const {access_type} = loggedUser;

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
                    user_id,
                    contractor: {id: contractor_id, name: contractorName, username},
                    form: {name: formName, desc, type, title_page_list, questions}
                } = old_data;

                let status, status_answered_by_sender, ccList = await ContractorQuestionnaireFuns.getEmailCCReceipients.call(this, {
                    loggedUser, user_id, contractor_id
                });

                switch (updateAttrs.status) {
                    case "Seen":
//                        skip this status. no email notification sent;
                        break;
                    case "CompleteRequested":
                        status = "requested";
                        break;
                    case "CompleteAccepted":
                        status = "accepted";
                        break;
                    case "CompleteDeclined":
                        status = "declined";
                        break;
                }

                switch (updateAttrs.status_answered_by_sender) {
                    case "ApprovalRequested":
                        status_answered_by_sender = "requested";
                        break;
                    case "ApprovalAccepted":
                        status_answered_by_sender = "accepted";
                        break;
                    case "ApprovalDeclined":
                        status_answered_by_sender = "declined";
                        break;
                }

                const companyName = await UserFuns.getUserCompanyName();

                if (status) {
                    const questionsLength = isArray(questions) ? questions.length : Object.values(questions).length;

                    let questionsArray;
                    if (!isArray(questions)) {
                        questionsArray = await Promise.all(Object.values(questions || {}).map(QuestionnaireFuns.unmapQuestionnaires(null, true)));
                    }
                    questionsArray = questionsArray.
                            map(v => v.questions || [v]).
                            reduce((a1, a2) => [...a1, ...a2], []).
                            filter(v => v.questionType !== 'NoAnswer');

                    const total = questionsArray.length;
                    const answerCount = questionsArray.filter(v => !!v.answer).length;
                    const percOfQuesAnswered = (answerCount / total) * 100;

                    const opts = {
                        from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                        to: username,
                        cc: ccList,
                        subject: contractorName + ' Questionnaire From ' + companyName,
                        html: '<h3><b>Good Day</b></h3>\n\
                                <p>Please note that the ' + formName + ' questionnaire completion has been <b>' + status + '</b>.</p>\n\
                                <hr />\n\
                                <p>Company: <b>' + companyName + '</b></p>\n\
                                <p>Title: <b>' + formName + '</b></p>\n\
                                <p>Questions Description: <b>' + desc + '</b></p>\n\
                                <p>Total No. Of Questions: <b>' + total + '</b></p>\n\
                                <p>No. Of Questions Required: <b>' + questionsArray.filter(v => !!v.isMandatory).length + '</b></p>\n\
                                <p>No. Of Questions Optional: <b>' + questionsArray.filter(v => !v.isMandatory).length + '</b></p>\n\
                                <p>No. Of Questions Answered: <b>' + answerCount + '</b></p>\n\
                                <p>No. Of Questions Unanswered: <b>' + questionsArray.filter(v => !v.answer).length + '</b></p>\n\
                                <p>Percentage Of Questions Answered: <b>' + percOfQuesAnswered.toFixed(1) + '% Complete</b></p>\n\
                                <hr />\n\
                                <p>Kind Regards<br/>SHEQ Aid</p>'
                    };

                    await Utils.sendEmail(opts);
                }
                
                if(status_answered_by_sender) {
                    const questionsLength = isArray(questions) ? questions.length : Object.values(questions).length;

                    let questionsArray;
                    if (!isArray(questions)) {
                        questionsArray = await Promise.all(Object.values(questions || {}).map(QuestionnaireFuns.unmapQuestionnaires(null, true)));
                    }
                    questionsArray = questionsArray.
                            map(v => v.questions || [v]).
                            reduce((a1, a2) => [...a1, ...a2], []).
                            filter(v => v.questionType !== 'NoAnswer');

                    const total = questionsArray.length;
                    const answerCount = questionsArray.filter(v => !!v.answer).length;
                    const percOfQuesAnswered = (answerCount / total) * 100;

                    const opts = {
                        from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                        to: username,
                        cc: ccList,
                        subject: contractorName + ' Questionnaire From ' + companyName,
                        html: '<h3><b>Good Day</b></h3>\n\
                                <p>Please note that the ' + formName + ' questionnaire approval has been <b>' + status_answered_by_sender + '</b>.</p>\n\
                                <hr />\n\
                                <p>Company: <b>' + companyName + '</b></p>\n\
                                <p>Title: <b>' + formName + '</b></p>\n\
                                <p>Questions Description: <b>' + desc + '</b></p>\n\
                                <p>Total No. Of Questions: <b>' + total + '</b></p>\n\
                                <p>No. Of Questions Required: <b>' + questionsArray.filter(v => !!v.isMandatory).length + '</b></p>\n\
                                <p>No. Of Questions Optional: <b>' + questionsArray.filter(v => !v.isMandatory).length + '</b></p>\n\
                                <p>No. Of Questions Answered: <b>' + answerCount + '</b></p>\n\
                                <p>No. Of Questions Unanswered: <b>' + questionsArray.filter(v => !v.answer).length + '</b></p>\n\
                                <p>Percentage Of Questions Answered: <b>' + percOfQuesAnswered.toFixed(1) + '% Complete</b></p>\n\
                                <hr />\n\
                                <p>Kind Regards<br/>SHEQ Aid</p>'
                    };

                    await Utils.sendEmail(opts);
                }

                const auditData = {id: doc_snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

                return true;
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

                let {parentId, ques, quesPath, newMsg} = data;

                quesPath = ques.quesPath || quesPath;

                if (access_type === "User" && newMsg) {
                    newMsg.logged_user_id = loggedUser.user.id;
                }

                delete ques.quesPath;
                delete ques.idx;

                const {linkDoc, expiry} = ques;
                if (linkDoc && linkDoc.id) {
                    ques.linkDoc = linkDoc.id;
                }

                if (parentId === 'TitlePage') {
                    if (QuestionnaireFuns.isQuestionFile(ques)) {
                        ques = await QuestionnaireFuns.uploadResponseFile.call(this, doc_snapshot.id, 'title_page_list', ques, quesPath);
                    }

                    Object.setValueByPath(form.title_page_list, quesPath, ques);
                } else if (parentId === 'Questions') {
                    if (QuestionnaireFuns.isQuestionFile(ques)) {
                        ques = await QuestionnaireFuns.uploadResponseFile.call(this, doc_snapshot.id, 'questions', ques, quesPath);
                    }

                    Object.setValueByPath(form.questions, quesPath, ques);
                }

                await doc_ref.set({form}, {merge: true});//Promise < void >

                doc_snapshot = await doc_ref.get();

                if (expiry || newMsg) {
                    const {
                        user_id,
                        contractor: {id: contractor_id, name: contractorName, username: contractorUsername},
                        form: {name: formName, desc, type, title_page_list, questions}
                    } = doc_snapshot.data();

                    //should create pre-notification
                    if (expiry) {
                        const ccListByCompany = await ContractorQuestionnaireFuns.getEmailCCReceipientsByCompany.call(this, {
                            loggedUser, user_id
                        });
                        const ccListByContractor = await ContractorQuestionnaireFuns.getEmailCCReceipientsByContractor.call(this, {
                            contractor_id
                        });

                        const idx = quesPath.filter(v => v.isNumeric()).map(v => parseInt(v) + 1).join('.');
                        await this.onCreateNotification({
                            newId: `${doc_snapshot.id}-${parentId}-${quesPath.join('.')}`,
                            module: '__B_Contractors',
                            _group: 'Questionnaire',
                            doc_snapshot,
                            details: {
                                expiry,
                                expiry_date: expiry,
                                parentId,
                                ques,
                                quesPath,
                                idx
                            },
                            ccListByCompany,
                            ccListByContractor,
                            contractorUsername
                        });
                    }

                    if (newMsg) {
                        let ccList = await ContractorQuestionnaireFuns.getEmailCCReceipients.call(this, {
                            loggedUser, user_id, contractor_id
                        });

                        const companyName = await UserFuns.getUserCompanyName();

                        const {sender: {uid}, msg, date} = newMsg;

                        const {id, data: {fname, lname, username}} = loggedUser.user;
                        const sentByName = fname + " " + lname + " (" + username + ")";

                        const opts = {
                            from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                            to: contractorUsername,
                            cc: ccList,
                            subject: companyName + ' Questionnaire Chat Message',
                            html: '<h3><b>Good Day</b></h3>\n\
                            <p>You have been sent the following message on the questionnaire:</p>\n\
                            <p>Company: <b>' + companyName + '</b></p>\n\
                            <p>Sent By: <b>' + sentByName + '</b></p>\n\
                            <p>Date Sent: <b>' + Dates.formatDate(date) + '</b></p>\n\
                            <p>Question: <b>' + ques.questionText + '</b></p>\n\
                            <p>Message Details: <b>' + msg + '</b></p>\n\
                            <p>Kind Regards<br/>SHEQ Aid</p>'
                        };

                        await Utils.sendEmail(opts);
                    }
                }

                ques.linkDoc = linkDoc;
                return {parentId, ques, quesPath};
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="by_logged_user_new">
        async by_logged_user_new(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: 'desc'}, q => {
                    q = q.where('contractor.id', '==', id);
                    return q;
                });
                console.log(evt, list, loggedUser)
                return await Promise.all(list.map(ContractorQuestionnaireFuns.mapQuestionnaireResults));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="by_logged_user_replied">
        async by_logged_user_replied(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: 'desc'}, q => {
                    q = q.where('contractor.id', '==', loggedUser.user.id);
                    return q;
                });
                console.log(evt, list, loggedUser)
                return await Promise.all(list.map(ContractorQuestionnaireFuns.mapQuestionnaireResults));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list;
                const onEdited = updateVal => {
                    const {
                        id,
                        data: {
                            form: new_form, form: {
                                name: new_formName,
                                desc: new_desc,
                                type: new_type,
                                title_page_list: new_title_page_list,
                                questions: new_questions
                            }
                        }
                    } = updateVal;

                    const oldVal = list.find(val => val.id === id);
                    if (oldVal) {
                        const {
                            data: {
                                form: old_form, form: {
                                    name: old_formName,
                                    desc: old_desc,
                                    type: old_type,
                                    title_page_list: old_title_page_list,
                                    questions: old_questions
                                }
                            }
                        } = oldVal;

                        const __toObject = (questionsObject) => {
                            const mapQuestionsToObject = (v, n) => {
                                if ('sectionText' in v) {
                                    isArray(v.questions) && (v.questions = v.questions.map(mapQuestionsToObject).toObject());
                                }
                                return v;
                            };

                            if (!isArray(questionsObject)) {
                                questionsObject = Object.values(questionsObject);
                            }
                            return questionsObject.map(mapQuestionsToObject).toObject();
                        };

                        const __toInnerQuestionsArray = (questionsObject) => {
                            const unmapQuestionnaires = (v, n) => {
                                if (v.questions) {
                                    return {...v, questions: Object.values(v.questions).map(unmapQuestionnaires)};
                                }
                                return v;
                            };

                            if (!isArray(questionsObject)) {
                                questionsObject = Object.values(questionsObject);
                            }
                            return questionsObject.map(unmapQuestionnaires).toObject();
                        };

                        const diff_title_page_list = Object.diff(new_title_page_list, __toObject(old_title_page_list));
                        const diff_questions = Object.diff(new_questions, __toObject(old_questions));

                        delete new_form.title_page_list;
                        delete new_form.questions;
                        delete old_form.title_page_list;
                        delete old_form.questions;
                        const diff_forms = Object.diff(new_form, old_form);

                        new_form.title_page_list = new_title_page_list;
                        new_form.questions = new_questions;
                        old_form.title_page_list = old_title_page_list;
                        old_form.questions = old_questions;

                        const data = {};
                        if (!Object.keys(diff_forms).isEmpty()) {
                            data.form = new_form;
                            data.diff_forms = diff_forms;
                        }
                        if (!Object.keys(diff_title_page_list).isEmpty()) {
                            data.title_page_list = __toInnerQuestionsArray(new_title_page_list);
                            data.diff_title_page_list = diff_title_page_list;
                        }
                        if (!Object.keys(diff_questions).isEmpty()) {
                            data.questions = __toInnerQuestionsArray(new_questions);
                            data.diff_questions = diff_questions;
                        }

                        list.replaceIf(updateVal, val => val.id === id);

                        Events.emit(`${this.root}onUpdate`, {updateVal, data});
                    }
                };
                list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, onEdited}, q => {
                    return q;
                });
                console.log(evt, list.length, loggedUser)
                return await Promise.all(list.map(ContractorQuestionnaireFuns.mapQuestionnaireResults));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_by_contractor_id">
        async list_by_contractor_id(evt, contractor_id) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                    q = q.where('contractor_id', '==', contractor_id);
                    q = q.orderBy('status', 'asc');
                    return q;
                });
                console.log(evt, list, loggedUser)
                return await Promise.all(list.map(ContractorQuestionnaireFuns.mapQuestionnaireResults));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_active">
        async list_active(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                    q = q.where('status', '!=', 'CompleteAccepted');
                    q = q.orderBy('status', 'asc');
                    return q;
                });
                console.log(evt, list, loggedUser)
                return await Promise.all(list.map(ContractorQuestionnaireFuns.mapQuestionnaireResults));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_complete">
        async list_complete(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                    q = q.where('status', '==', 'CompleteAccepted');
                    return q;
                });
                console.log(evt, list.length, loggedUser)
                return await Promise.all(list.map(ContractorQuestionnaireFuns.mapQuestionnaireResults));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_active_filter">
        async list_active_filter(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name, isNew} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                    q = q.where('status', '!=', 'CompleteAccepted');
                    q = q.where('form.name', '==', name);
                    q = q.orderBy('status', 'asc');
                    return q;
                });
                console.log(evt, list.length, loggedUser)
                return await Promise.all(list.map(ContractorQuestionnaireFuns.mapQuestionnaireResults));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_complete_filter">
        async list_complete_filter(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name, isNew} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1}, q => {
                    q = q.where('status', '==', 'CompleteAccepted');
                    q = q.where('form.name', '==', name);
                    return q;
                });
                console.log(evt, list.length, loggedUser)
                return await Promise.all(list.map(ContractorQuestionnaireFuns.mapQuestionnaireResults));
            });
        }
        // </editor-fold>

        sortBy() {
            return "form.name";
        }
    }

    new Controller(events, db);
})();