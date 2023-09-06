
(function () {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events,
                    {singular: "COID Claim", plural: "COID Claims"},
                    "plugin_sheq_assist/COIDA_Management/claims/medical-center/",
                    "plugin_sheq_assist_coida_claims"
                    );

            const {addAction} = this;
            addAction("list/filter", this.filter.bind(this));
            addAction("email", this.send_email.bind(this));
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {
                    client, project, site,
                    employee_id,
                    claim_number,
                    provincial_office,
                    accident_date,
                    annexture_1,
                    wcl_1, wcl_2, wcl_3, wcl_4, wcl_5_list = [], wcl_6,
                    doctor_email
                } = data;

                if (!claim_number) {
                    data.claim_number = null;
                }
                if (!provincial_office) {
                    data.provincial_office = null;
                }

                const d = new Date();
                data.ref_num = parseInt(d.getFullYear() + Dates.monthsDoubleNumStr.get(d.getMonth()) + Dates.daysDoubleNumStr.get(d.getDate()));
//                
//                //'Submit - CF',
                data.status = "Pending";

//                  'Old Claim - No Data On CompEasy',
//                  'Not Employed',
//                  'Reject',
//                  'Liability Repudiated',
//                  'Accepted',
//                  'Liability Accepted',
//                  'Wait on info',
//                  'Adjudication still Pending',
//                  'Request Claim no'
                data.claim_status = null;

                const setSplitDate = (o, key) => {
                    if (!o)
                        return;

                    const date = o[key];
                    const __date = Dates.parse(date);
                    if (!__date)
                        return;

                    o[`${key}_split`] = {
                        year: __date.getFullYear(),
                        month: __date.getMonth(),
                        date: __date.getDate(),
                        day: __date.getDay(),
                        week: __date.getWeekNumber()
                    };
                };

                setSplitDate(data, 'accident_date');

                setSplitDate(annexture_1, 'accident_date');
                setSplitDate(annexture_1, 'investigation_date');
                setSplitDate(annexture_1, 'investigator_signature_date');
                setSplitDate(annexture_1, 'employer_signature_date');
                setSplitDate(annexture_1, 'chairperson_of_health_and_safety_committee_signature_date');

                setSplitDate(wcl_2, 'dob');
                setSplitDate(wcl_2, 'accident_date');
                setSplitDate(wcl_2, 'accident_date_reported');
                if (wcl_2 && wcl_2.period_payments_made_range) {
                    setSplitDate(wcl_2.period_payments_made_range, 'date_from');
                    setSplitDate(wcl_2.period_payments_made_range, 'date_to');
                }
                setSplitDate(wcl_2, 'date_ceased_work');
                setSplitDate(wcl_2, 'date_resumed_work');
                setSplitDate(wcl_2, 'accident_date_reported');
                setSplitDate(wcl_2, 'employer_signature_date');

                setSplitDate(wcl_4, 'accident_date');
                setSplitDate(wcl_4, 'first_consultation_date');
                setSplitDate(wcl_4, 'x_rays_date');
                setSplitDate(wcl_4, 'surgical_procedure_date');
                setSplitDate(wcl_4, 'consultation_date');
                setSplitDate(wcl_4, 'employee_fitness_light_duty_date');
                setSplitDate(wcl_4, 'employee_fitness_normal_duty_date');
                setSplitDate(wcl_4, 'practioner_signature_date');

                if (wcl_5_list) {
                    wcl_5_list.forEach(wcl_5 => {
                        setSplitDate(wcl_5, 'accident_date');
                        //setSplitDate(wcl_5, 'operation_procedure_test_carried_out_and_dates');
                        setSplitDate(wcl_5, 'employee_been_fit_normal_work_date');
                        setSplitDate(wcl_5, 'employee_likely_to_be_fit_normal_work_date');
                        setSplitDate(wcl_5, 'practioner_signature_date');
                    });
                }

                setSplitDate(wcl_6, 'accident_date');
                setSplitDate(wcl_6, 'employer_signature_date');

                const uploadFile = ({sec, secName, key, listName, list, idx}) => {
                    if (!sec)
                        return;

                    const file = sec[key];
                    if (!file)
                        return;

                    delete sec[key];

                    return {
                        secName,
                        listName,
                        idx,
                        file,
                        key,
                        upload: async ({savedItem, secName, listName, idx, file, key}) => {
                            const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                                const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                                if(listName) {
                                    listName = `${listName}/${idx}/`;
                                } else {
                                    listName = '';
                                }
                                const new_name = `${this.tbl}/${savedItem.id}/${listName}${secName}/${key}/${name}`;
                                return new_name;
                            }.bind(this)).catch(e => {
                                //                      doc_ref.delete();//Promise < void >
                                throw e;
                            });
                            return gcsUri;
                        }
                    };
                };

                const uploadPromises = [
                    uploadFile({sec: wcl_2, secName: 'wcl_2', key: 'doc_certified_id'}),
                    uploadFile({sec: wcl_2, secName: 'wcl_2', key: 'doc_salary_slip'}),
                    uploadFile({sec: wcl_4, secName: 'wcl_4', key: 'x_rays_report'}),

                    uploadFile({sec: wcl_4, secName: 'wcl_4', key: 'external_doc'})
                ];
                if (wcl_5_list) {
                    uploadPromises.push(...wcl_5_list.map((wcl_5, idx) =>
                        uploadFile({
                            sec: wcl_5,
                            secName: 'wcl_5',
                            key: 'external_doc',
                            list: wcl_5_list,
                            listName: 'wcl_5_list',
                            idx
                        })
                    ));
                }

                let savedItem = await AControllerAid.prototype.create.call(this, evt, data);
                if (savedItem) {
                    const updateAttrs = {};
                    await Promise.all(uploadPromises.filter(v => !!v).map(async ({secName, listName, file, key, idx, upload}) => {
                        const gcsUri = await upload({savedItem, file, secName, listName, key, idx});
                        if (listName) {
                            savedItem.data[listName][idx] = {
                                [secName]: {[key]: gcsUri}
                            };
                            updateAttrs[listName] = savedItem.data[listName];
                        } else {
                            updateAttrs[secName] = {[key]: gcsUri};
                        }
                    }));

                    if (!Object.keys(updateAttrs).isEmpty()) {
                        await AControllerAid.prototype.update.call(this, evt, savedItem.id, updateAttrs);

                        const reassignFile = ({updateAttrs, savedItem, secName, key}) => {
                            if (!updateAttrs[secName] || !updateAttrs[secName][key])
                                return;
                            savedItem.data[secName][key] = updateAttrs[secName][key];
                        };
                        reassignFile({updateAttrs, savedItem, secName: 'wcl_2', key: 'doc_certified_id'});
                        reassignFile({updateAttrs, savedItem, secName: 'wcl_2', key: 'doc_salary_slip'});
                        reassignFile({updateAttrs, savedItem, secName: 'wcl_4', key: 'x_rays_report'});
                        reassignFile({updateAttrs, savedItem, secName: 'wcl_4', key: 'external_doc'});
                        if (wcl_5_list) {//already assigned
//                        reassignFile(updateAttrs, savedItem, 'wcl_5_list', 'external_doc');
                        }
                    }

                    savedItem = await mapResults.call(this, savedItem);

                    if (doctor_email) {
                        const actionCodeSettings = {
                            // URL you want to redirect back to. The domain (www.example.com) for this
                            // URL must be in the authorized domains list in the Firebase Console.
                            url: `https://forms.sheqaid.com/cm/mcsp/?id=${savedItem.id}`,
                            // This must be true.
                            handleCodeInApp: true,
                            dynamicLinkDomain: 'sheqaid.page.link'
                        };
                        await auth.sendSignInLinkToEmail(doctor_email, actionCodeSettings).then(() => {
                            // The link was successfully sent. Inform the user.
                            // Save the email locally so you don't need to ask the user for it again
                            // if they open the link on the same device.
//                            window.localStorage.setItem('emailForSignIn', doctor_email);
                            // ...
                        }).catch((err) => {
                            const {code, message} = err;
                            console.error(err)
                        });
                    }
                }
                return savedItem;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const {
                    client, project, site,
                    employee_id,
                    claim_number,
                    provincial_office,
                    accident_date,
                    annexture_1,
                    wcl_1, wcl_2, wcl_3, wcl_4, wcl_5_list, wcl_6,
                    doctor_email
                } = updateAttrs;

                const setSplitDate = (o, key) => {
                    if (!o)
                        return;

                    const date = o[key];
                    const __date = Dates.parse(date);
                    if (!__date)
                        return;

                    o[`${key}_split`] = {
                        year: __date.getFullYear(),
                        month: __date.getMonth(),
                        date: __date.getDate(),
                        day: __date.getDay(),
                        week: __date.getWeekNumber()
                    };
                };

                setSplitDate(updateAttrs, 'accident_date');

                setSplitDate(annexture_1, 'accident_date');
                setSplitDate(annexture_1, 'investigation_date');
                setSplitDate(annexture_1, 'investigator_signature_date');
                setSplitDate(annexture_1, 'employer_signature_date');
                setSplitDate(annexture_1, 'chairperson_of_health_and_safety_committee_signature_date');

                setSplitDate(wcl_2, 'dob');
                setSplitDate(wcl_2, 'accident_date');
                setSplitDate(wcl_2, 'accident_date_reported');
                if (wcl_2 && wcl_2.period_payments_made_range) {
                    setSplitDate(wcl_2.period_payments_made_range, 'date_from');
                    setSplitDate(wcl_2.period_payments_made_range, 'date_to');
                }
                setSplitDate(wcl_2, 'date_ceased_work');
                setSplitDate(wcl_2, 'date_resumed_work');
                setSplitDate(wcl_2, 'accident_date_reported');
                setSplitDate(wcl_2, 'employer_signature_date');

                setSplitDate(wcl_4, 'accident_date');
                setSplitDate(wcl_4, 'first_consultation_date');
                setSplitDate(wcl_4, 'x_rays_date');
                setSplitDate(wcl_4, 'surgical_procedure_date');
                setSplitDate(wcl_4, 'consultation_date');
                setSplitDate(wcl_4, 'employee_fitness_light_duty_date');
                setSplitDate(wcl_4, 'employee_fitness_normal_duty_date');
                setSplitDate(wcl_4, 'practioner_signature_date');

                if (wcl_5_list) {
                    wcl_5_list.forEach(wcl_5 => {
                        setSplitDate(wcl_5, 'accident_date');
                        //setSplitDate(wcl_5, 'operation_procedure_test_carried_out_and_dates');
                        setSplitDate(wcl_5, 'employee_been_fit_normal_work_date');
                        setSplitDate(wcl_5, 'employee_likely_to_be_fit_normal_work_date');
                        setSplitDate(wcl_5, 'practioner_signature_date');
                    });
                }

                setSplitDate(wcl_6, 'accident_date');
                setSplitDate(wcl_6, 'employer_signature_date');

                const uploadFile = (data, secName, key) => {
                    if (!data)
                        return;

                    const sec = data[secName];
                    if (!sec)
                        return;

                    if (isArray(sec)) {
                        return sec.filter(sec_v => !!sec_v[key]).map((sec_v, idx) => {
                            const file = sec_v[key];
                            if (!file)
                                return;
                            delete sec_v[key];
                            return {
                                file,
                                secName,
                                key,
                                idx: idx + 1,
                                upload: async (savedItem, file, secName, key, idx) => {
                                    const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                                        const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                                        const new_name = `${this.tbl}/${savedItem.id}/${secName}/${key}/${idx}/${name}`;
                                        return new_name;
                                    }.bind(this)).catch(e => {
                                        //                      doc_ref.delete();//Promise < void >
                                        throw e;
                                    });
                                    return gcsUri;
                                }
                            };
                        });
                    } else {
                        const file = sec[key];
                        if (!file)
                            return;

                        delete sec[key];

                        return {
                            file,
                            secName,
                            key,
                            upload: async (savedItem, file, secName, key) => {
                                const gcsUri = await files.upload.call(this, file, async function (bucketFile) {
                                    const name = fileUtils.getFileName(file).replaceAll(' ', '_');
                                    const new_name = `${this.tbl}/${savedItem.id}/${secName}/${key}/${name}`;
                                    return new_name;
                                }.bind(this)).catch(e => {
                                    //                      doc_ref.delete();//Promise < void >
                                    throw e;
                                });
                                return gcsUri;
                            }
                        };
                    }
                };

                const uploadPromises = [
                    uploadFile(updateAttrs, 'wcl_2', 'doc_certified_id'),
                    uploadFile(updateAttrs, 'wcl_2', 'doc_salary_slip'),
                    uploadFile(updateAttrs, 'wcl_4', 'x_rays_report'),

                    uploadFile(updateAttrs, 'wcl_4', 'external_doc')
                ];
                if (wcl_5_list) {
//                    uploadPromises.push(...wcl_5_list.map(wcl_5 => uploadFile(data, 'wcl_5_list', 'external_doc')));
                }

                let savedItem;
                let savedData = await AControllerAid.prototype.update.call(this, evt, id, updateAttrs);
                if (savedData) {
                    savedItem = {id, data: savedData};
                    updateAttrs = {};

                    await Promise.all(uploadPromises.filter(v => !!v).map(async ({file, secName, key, idx, upload}) => {
                        const gcsUri = await upload(savedItem, file, secName, key, idx);
                        updateAttrs[secName] = {[key]: gcsUri};
                    }));

                    if (!Object.keys(updateAttrs).isEmpty()) {
                        await AControllerAid.prototype.update.call(this, evt, id, updateAttrs);

                        const reassignFile = (updateAttrs, savedItem, secName, key) => {
                            if (!updateAttrs[secName] || !updateAttrs[secName][key])
                                return;
                            savedItem.data[secName][key] = updateAttrs[secName][key];
                        };
                        reassignFile(updateAttrs, savedItem, 'wcl_2', 'doc_certified_id');
                        reassignFile(updateAttrs, savedItem, 'wcl_2', 'doc_salary_slip');
                        reassignFile(updateAttrs, savedItem, 'wcl_4', 'x_rays_report');
                        reassignFile(updateAttrs, savedItem, 'wcl_4', 'external_doc');
                        if (wcl_5_list) {
//                        reassignFile(updateAttrs, savedItem, 'wcl_5_list', 'external_doc');
                        }
                    }

                    savedItem = await mapResults.call(this, savedItem);

                    if (doctor_email) {
                        const actionCodeSettings = {
                            // URL you want to redirect back to. The domain (www.example.com) for this
                            // URL must be in the authorized domains list in the Firebase Console.
                            url: `https://forms.sheqaid.com/cm/mcsp/?id=${savedItem.id}`,
                            // This must be true.
                            handleCodeInApp: true,
                            dynamicLinkDomain: 'sheqaid.page.link'
                        };
                        auth.sendSignInLinkToEmail(doctor_email, actionCodeSettings).then(() => {
                            // The link was successfully sent. Inform the user.
                            // Save the email locally so you don't need to ask the user for it again
                            // if they open the link on the same device.
//                            window.localStorage.setItem('emailForSignIn', doctor_email);
                            // ...
                        }).catch((error) => {
                            const {code, message} = error;

                        });
                    }
                }
                return savedItem;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="send_email">
        async send_email(evt, id, doctor_email) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const updated = await doc_ref.set({doctor_email}, {merge: true});//Promise < void >
                doc_snapshot = await doc_ref.get();

                const res = await mapResults.call(this, {id: doc_snapshot.id, data: doc_snapshot.data()});

//                const opts = {
//                    from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
//                    to: doctor_email,
//                    subject: doc_name.singular + ' Document Removed From SHEQ Aid',
//                    html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
//                        <p>Please note that the link of the document that was sent to you has been removed.</p>\n\
//                        <hr />\n\
//                        <p>Document Title: <b>' + (sharedDocTitle || doc_name.singular) + '</b></p>\n\
//                        <p>Document Editing Allowed: <b>' + (allow_doc_editing || "No") + '</b></p>\n\
//                        <hr />\n\
//                        <p>The link expires on: <b>' + Dates.formatDate(doc_expiry_date) + '</b></p>\n\
//                        <p>Kind Regards<br/>SHEQ Aid</p>'
//                };
//                await Utils.sendEmail(opts);
            });
        }
        // </editor-fold>

        async export_excel(evt, date_range) {
            return Events.whenLoggedIn(async loggedUser => {
                let {list, date_from, date_to, type, business_id} = date_range;
                if (!list) {
                    list = await this.list(evt);
                    
                    const d_from = new Date(date_from);
                    d_from.setHours(0);
                    d_from.setMinutes(0);
                    d_from.setSeconds(0);

                    const d_to = new Date(date_to);
                    d_to.setHours(23);
                    d_to.setMinutes(59);
                    d_to.setSeconds(59);
                    const q = [
                        {key: 'created_at.getTime()', comp: '>=', val: d_from.getTime()},
                        {key: 'created_at.getTime()', comp: '<=', val: d_to.getTime()}
                    ];
                    list = await this.filter_impl(evt, q, list);
                }

                if (list.isEmpty()) {
                    return "EMPTY";
                }

                const cols = [
                    {header: 'Business ID', key: 'Business ID', width: 35},
//                    {header: 'ConsentO', key: 'ConsentO', width: 35},
                    {header: 'SAIDorPassportNumber', key: 'SAIDorPassportNumber', width: 35},
                    {header: 'Screening date', key: 'Screening date', width: 35},
                    {header: 'Province', key: 'Province', width: 35},
                    {header: 'District', key: 'District', width: 35},
                    {header: 'Employee Gender', key: 'Employee Gender', width: 35},
                    {header: 'Employee Age', key: 'Employee Age', width: 35},
                    {header: 'Job Category*', key: 'Job Category*', width: 35},

                    {header: 'Symptoms Present (yes/ no)**', key: 'Symptoms Present (yes/ no)**', width: 35},
                    {header: 'Fever >380c', key: 'Fever >380c', width: 35},
                    {header: 'Chills', key: 'Chills', width: 35},
                    {header: 'Dry cough', key: 'Dry cough', width: 35},
                    {header: 'Sore throat', key: 'Sore throat', width: 35},
                    {header: 'Shortness of breath', key: 'Shortness of breath', width: 35},
                    {header: 'Tiredness', key: 'Tiredness', width: 35},
                    {header: 'Lack of smell or taste', key: 'Lack of smell or taste', width: 35},
                    {header: 'Conjuctivitis', key: 'Conjuctivitis', width: 35},
                    {header: 'Diarrhoea', key: 'Diarrhoea', width: 35},
                    {header: 'Muscle pains', key: 'Muscle pains', width: 35},
                    {header: 'Nausea or vomiting', key: 'Nausea or vomiting', width: 35},
                    {header: 'Dizziness', key: 'Dizziness', width: 35},
                    {header: 'Headache', key: 'Headache', width: 35}
                ];

                if (type === "Internal") {
                    cols.pushAll([
                        {header: 'Have you been in contact with someone with COVID-19?', key: 'Have you been in contact with someone with COVID-19?', width: 35},
                        {header: 'Have you been traveling or been at the following locations: Doctor; High risk area or event in the last 14 days?', key: 'Have you been traveling or been at the following locations: Doctor; High risk area or event in the last 14 days?', width: 35},
                        {header: "Do you deem yourself medically fit and to the best of your knowledge you don't have COVID-19?", key: "Do you deem yourself medically fit and to the best of your knowledge you don't have COVID-19?", width: 35},
                        {header: 'Are you wearing a mask', key: 'Are you wearing a mask', width: 35},
                    ]);
                }

                cols.push({header: 'Screening Outcome', key: 'Screening Outcome', width: 35});

//                const {employee: {id, data: {fname, lname}}, employee_id, consent, business_id, date, sex, age, province, district, job_category, outcome, symptoms_status} = form.data;
//                const data = {
//                    employee: {id, fname, lname}, employee_id, consent, business_id, date: date.getTime(), sex, age, province, district, job_category, outcome, symptoms_status
//                };
//
//                if (checklist) {
//                    data.checklist = checklist;
//                }

                const rows = list.map(({id, data: {
                employee, employee_id, consent, business_id: __business_id, date, sex, age, province, district, job_category, outcome, symptoms_status, checklist
                }}) => {
                    const employee_uid = employee.id;
                    const findChecklist = key => {
                        if (checklist && Array.isArray(checklist)) {
                            const res = checklist.find(v => v.key === key);
                            if (res) {
                                if (key === "temperature") {
                                    return res.status > 38 ? "Yes" : "No";
                                } else {
                                    return res.status;
                                }
                            }
                        }
                        return "";
                    };
                    let val;
                    const formatDate = (date) => {
                        date = Dates.formatDate(date);
                        if (!date)
                            return "";
                        const arr = date.split('-');
                        const mNum = Dates.monthsNum.get(arr[1]);//0-11
                        const mNumStr = Dates.monthsDoubleNumStr.get(mNum);//1-12
                        return `${arr[2]}/${mNumStr}/${arr[0]}`;
                    };
                    const getJobCategory = job_category => {
                        if (!job_category)
                            return "";
                        if (isString(job_category))
                            return job_category;
                        const {name, data} = job_category;
                        return name || data.name;
                    };
                    if (type === "API") {
                        val = {
                            id,
                            "SAIDorPassportNumber": employee_id || "",
                            "ScreeningDate": formatDate(date),
                            "EmployeeAge": String(age || ""),
                            "EmployeeGender": sex || "",
                            "JobCategory": getJobCategory(job_category),
                            "Province": province || "",
                            "District": district || "",
                            "SymptomsPresent": symptoms_status || "",
                            "ScreeningOutcomeNoActionRequired": outcome === "No Action Required" ? "Yes" : "No",
                            "ScreeningOutcomeReferredForSelfIsolation": outcome === "Referred For Self-Isolation" ? "Yes" : "No",
                            "ScreeningOutcomeReferredForTesting": outcome === "Referred For Testing" ? "Yes" : "No",
                            "ScreeningOutcomeReferredToTheDoctor": outcome === "Referred To The Doctor" ? "Yes" : "No",
                            "Fever": findChecklist("temperature"),
                            "Chills": findChecklist("chillis"),
                            "DryCough": findChecklist("dry_cough"),
                            "SoreThroat": findChecklist("sore_throat"),
                            "ShortnessOfBreath": findChecklist("shortness_of_breath"),
                            "Tiredness": findChecklist("tireness"),
                            "LackOfSmellOrTaste": findChecklist("loss_of_smell_or_taste"),
                            "Conjuctivitis": findChecklist("redness_of_eye"),
                            "Diarrhoea": findChecklist("diarrhea"),
                            "NauseaOrVomiting": findChecklist("nausea_or_vomiting"),
                            "MusclePains": findChecklist("muscle_pains"),
                            "Dizziness": findChecklist("dizziness"),
                            "Headache": findChecklist("headache"),
                            "Update": 0
                        };
                    } else {
                        val = {
                            'Business ID': business_id || __business_id,
//                        ConsentO: consent,
                            "SAIDorPassportNumber": employee_id,
                            "Screening date": formatDate(date),
                            Province: province,
                            District: district,
                            "Employee Gender": sex,
                            "Employee Age": age,
                            "Job Category*": getJobCategory(job_category),

                            'Symptoms Present (yes/ no)**': symptoms_status,
                            'Fever >380c': findChecklist("temperature"),
                            Chills: findChecklist("chillis"),
                            "Dry cough": findChecklist("dry_cough"),
                            "Sore throat": findChecklist("sore_throat"),
                            'Shortness of breath': findChecklist("shortness_of_breath"),
                            Tiredness: findChecklist("tireness"),
                            'Lack of smell or taste': findChecklist("loss_of_smell_or_taste"),
                            'Conjuctivitis': findChecklist("redness_of_eye"),
                            Diarrhoea: findChecklist("diarrhea"),
                            'Muscle pains': findChecklist("muscle_pains"),
                            'Nausea or vomiting': findChecklist("nausea_or_vomiting"),
                            Dizziness: findChecklist("dizziness"),
                            Headache: findChecklist("headache"),

                            'Screening Outcome': outcome
                        };
                    }
                    if (type === "Internal") {
                        val['Have you been in contact with someone with COVID-19?'] = findChecklist("in_contact_with_covid_patient");
                        val['Have you been traveling or been at the following locations: Doctor; High risk area or event in the last 14 days?'] = findChecklist("last_14_days_travelled");
                        val["Do you deem yourself medically fit and to the best of your knowledge you don't have COVID-19?"] = findChecklist("am_medically_fit");
                        val['Are you wearing a mask'] = findChecklist("are_you_wearing_a_mask");
                    }

                    return val;
                });

                if (type === "API") {
                    return rows;
                } else {
                    return await this.export_excel_impl(loggedUser, "COVID-Docs", "Screening", "Screening Data", cols, rows);
                }
            });
        }

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAid.prototype.list.call(this, evt);
                list = await Promise.all(list.map(mapResults.bind(this)));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {

            });
        }
        // </editor-fold>

    }

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item) {
        let {
            id,
            data: {
                employee_id,
                wcl_2,
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        delete item.data.password;

        const promise = [];
        if (employee_id) {
            promise.push(Events.get('plugin_sheq_assist/employees/').then(employees_ctrl => {
                return employees_ctrl.find_by_id.call(employees_ctrl, null, employee_id);
            }).then(val => {
                if (val) {
                    item.data.employee = val;
                }
            }));
        }
        if (wcl_2) {
            const {company_contact_person} = wcl_2;
            if (company_contact_person) {
                promise.push(Events.get('plugin_sheq_assist/employees/').then(employees_ctrl => {
                    return employees_ctrl.find_by_id.call(employees_ctrl, null, company_contact_person.id);
                }).then(val => {
                    if (val) {
                        wcl_2.company_contact_person = val;
                    }
                }));
            }
        }
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        await Promise.all(promise);
//                    console.log(this.tbl, item)
        return item;
    }
    // </editor-fold>

    new Controller(events);

})();