
(() => {
    class Controller extends AInternalAuditCheckablesController {
        //title, type, document
        constructor(events, db) {
            super(events, db, {singular: "Inspection Schedule", plural: "Inspection Schedules"}, "plugin_sheq_assist/21_Internal_Audit/inspection/schedules/", "21_Internal_Audit_inspection_schedules");
        }

        getDB() {
            return db2;
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);

                let {
                    user_id,
                    employee_id,
                    template_id,
                    interval, start_date,
                    form, form: {name: formName, desc, type, title_page_list, questions}
                } = data;

                let expiry;
                if (interval === 'Daily') {
                    expiry = data.expiry = start_date.toDate().addDays(1);
                } else if (interval === 'Weekly') {
                    expiry = data.expiry = start_date.toDate().addWeeks(1);
                } else if (interval === 'Monthly') {
                    expiry = data.expiry = start_date.toDate().addMonths(1);
                } else if (interval === 'Quarterly') {
                    expiry = data.expiry = start_date.toDate().addMonths(3);
                } else if (interval === 'Bi-Annually') {
                    expiry = data.expiry = start_date.toDate().addMonths(6);
                } else {
                    expiry = data.expiry = start_date.toDate().addYears(1);
                }

                const employee_doc_ref = await db_hr.collection('employees').doc(employee_id);//Promise < DocumentReference < T > >
                let employee_doc_snapshot = await employee_doc_ref.get();//Promise < DocumentSnapshot < T > >;
                if (!employee_doc_snapshot.exists) {
                    return 'RESPONSIBLE_PERSON_NOT_EXISTS';
                }

                if (QuestionnaireFuns.hasQuestionFile(title_page_list)) {
                    delete form.title_page_list;
                }
                if (QuestionnaireFuns.hasQuestionFile(questions)) {
                    delete form.questions;
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

                const ccList = await AuditQuestionnaireFuns.getEmailCCReceipientsByCompany.call(this, {
                    loggedUser, user_id
                });

                //should create pre-notification
                await this.onCreateNotification({
                    newId: doc_snapshot.id,
                    module: '_21_Internal_Audit',
                    _group: 'Inspection',
                    doc_snapshot,
                    details: {
                        expiry: expiry.getTime(),
                        expiry_date: expiry,
                        employee_id: employee_doc_snapshot.id,
                        interval,
                        formName
                    },
                    ccList,
                    employeeEmail: employee_doc_snapshot.get('email') || null
                });

                let questionsArray = await Promise.all(Object.values(questions || {}).
                        map(QuestionnaireFuns.unmapQuestionnaires(null, false)));
                questionsArray = questionsArray.
                        map(v => v.questions || [v]).
                        reduce((a1, a2) => [...a1, ...a2], []).
                        filter(v => v.questionType !== 'NoAnswer');

                const opts = {
                    from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                    to: employee_doc_snapshot.get('email'),
                    cc: ccList,
                    subject: 'Scheduled Inspection From SHEQ Aid',
                    html: '<h3><b>Good Day</b></h3>\n\
                        <p>Dear ' + employee_doc_snapshot.get('fname') + ' ' + employee_doc_snapshot.get('lname') +', \n\
                        you have been sent ' + formName + ' inspection questionnaire to answer.</p>\n\
                        <hr />\n\
                        <p>Title: <b>' + formName + '</b></p>\n\
                        <p>Questions Description: <b>' + desc + '</b></p>\n\
                        <p>Interval: <b>' + interval + '</b></p>\n\
                        <p>Note: This inspection questionnaire needs to be answered <b>' + interval + '</b></p>\n\
                        <p>Total No. Of Questions: <b>' + questionsArray.length + '</b></p>\n\
                        <p>No. Of Questions Required: <b>' + questionsArray.filter(v => !!v.isMandatory).length + '</b></p>\n\
                        <p>No. Of Questions Optional: <b>' + questionsArray.filter(v => !v.isMandatory).length + '</b></p>\n\
                        <hr />\n\
                        <p>You will be required to use SHEQ Aid application to answer the inspection questionnaire</p>\n\
                        <hr />\n\
                        <p>Kind Regards<br/>SHEQ Aid</p>'
                };

                await Utils.sendEmail(opts);

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return await AuditQuestionnaireFuns.mapQuestionnaireResults(auditData);
            });
        }
    }

    new Controller(events, db);
})();