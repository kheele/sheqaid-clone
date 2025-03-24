(function () {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events) {
            super(events,
                {singular: "COID ClaimsClient", plural: "COID Claims"},
                "plugin_sheq_assist/COIDA_Management/claims/coid-provider/",
                "plugin_sheq_assist_coida_claims"
            );

            const {addAction} = this;
            addAction("list/filter", this.filter.bind(this));
            addAction("email", this.send_email.bind(this));
            addAction("claim-status", this.update_claim_status.bind(this));
            addAction("status", this.update_status.bind(this));
            addAction("export-excel", this.export_excel.bind(this));

            addAction("select/filter", this.filter_select.bind(this));

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

//                  'Old ClaimsClient - No Data On CompEasy',
//                  'Not Employed',
//                  'Reject',
//                  'Liability Repudiated',
//                  'Accepted',
//                  'Liability Accepted',
//                  'Wait on info',
//                  'Adjudication still Pending',
//                  'Request ClaimsClient no'
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
                                if (listName) {
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
                    await Promise.all(uploadPromises.filter(v => !!v).map(async ({
                                                                                     secName,
                                                                                     listName,
                                                                                     file,
                                                                                     key,
                                                                                     idx,
                                                                                     upload
                                                                                 }) => {
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
                            url: `https://forms.sheqintel.com/cm/mcsp/?id=${savedItem.id}`,
                            // This must be true.
                            handleCodeInApp: true,
                            dynamicLinkDomain: 'sheqintel.page.link'
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
                            url: `https://forms.sheqintel.com/cm/mcsp/?id=${savedItem.id}`,
                            // This must be true.
                            handleCodeInApp: true,
                            dynamicLinkDomain: 'sheqintel.page.link'
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

        // <editor-fold defaultstate="collapsed" desc="update_claim_status">
        async update_claim_status(evt, id, claim_status) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return 'NOT_FOUND';
                }

                const res = await this.update(evt, id, {claim_status});

                if (res) {
                    let {
                        company: {id: receipient_coid_provider_id, data: {consultant, name: sender_name}},
                        client_id, project_id, site_id
                    } = loggedUser;

                    const {company_name, employee} = res.data;
//                    await sendEmail(
//                            receipient_coid_provider,
//                            'ClaimsClient Management (ClaimsClient Number Added/Updated)',
//                            `<p>${sender_name} has added/updated the claim status (${claim_status}).</p>\n`
//                            );
                }
                return !!res;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update_status">
        async update_status(evt, id, status) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return 'NOT_FOUND';
                }

                const res = await this.update(evt, id, {status});

                if (res) {
                    let {
                        company: {id: receipient_coid_provider_id, data: {consultant, name: sender_name}},
                        client_id, project_id, site_id
                    } = loggedUser;

                    const {company_name, employee} = res.data;
//                    await sendEmail(
//                            receipient_coid_provider,
//                            'ClaimsClient Management (ClaimsClient Number Added/Updated)',
//                            `<p>${sender_name} has added/updated the claim status (${claim_status}).</p>\n`
//                            );
                }
                return !!res;
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

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                if (list.isEmpty()) {
                    return "EMPTY";
                }

                console.log('print', list)

                const cols = [
                    {header: 'Ref #', key: 'Ref #', width: 35},
                    {header: 'Business Name', key: 'Business Name', width: 35},
                    {header: 'CF Register No.', key: 'CF Register No.', width: 35},
                    {header: 'Claim No.', key: 'Claim No.', width: 35},
                    {header: 'Gender', key: 'Gender', width: 35},
                    {header: 'First Name', key: 'First Name', width: 35},
                    {header: 'Last Name', key: 'Last Name', width: 35},
                    {header: 'ID / Passport No.', key: 'ID / Passport No.', width: 35},
                    {header: 'Injury / Disease / Fatal', key: 'Injury / Disease / Fatal', width: 35},
                    {header: 'Claim Status', key: 'Claim Status', width: 35},
                    {header: 'Occupation', key: 'Occupation', width: 35},
                    {header: 'Progress - Requirments', key: 'Progress - Requirments', width: 35},
                    {header: 'Date of Accident', key: 'Date of Accident', width: 35},
                    {header: 'Book off', key: 'Book off', width: 35},
                    {header: 'Light Duty From', key: 'Light Duty From', width: 35},
                    {header: 'Light Duty To', key: 'Light Duty To', width: 35},
                    {header: 'Fit for Duty', key: 'Fit for Duty', width: 35},
                    {header: 'Days Off', key: 'Days Off', width: 35},
                    {header: 'Place of Accident', key: 'Place of Accident', width: 35},
                    {
                        header: 'Accident Detais as per WCI.2 - Employers Report',
                        key: 'Accident Detais as per WCI.2 - Employers Report',
                        width: 35
                    },
                    {header: 'Injury Type', key: 'Injury Type', width: 35},
                    {header: 'Employer WCI.2', key: 'Employer WCI.2', width: 35},
                    {header: 'Certified ID', key: 'Certified ID', width: 35},
                    {header: 'Salary Slip', key: 'Salary Slip', width: 35},
                    {header: '1st Report', key: '1st Report', width: 35},
                    {header: 'Progress Report', key: 'Progress Report', width: 35},
                    {header: 'Final Report', key: 'Final Report', width: 35},
                    {header: 'Resumption Report', key: 'Resumption Report', width: 35}
                ];

                const rows = list.map(v => {
                    const {
                        id,
                        data: {
                            created_at,
                            client, project, site,
                            //
                            employee, employee_id,
                            claim_number,
                            accident_date,
                            //
                            wcl_2 = {},
                            wcl_4 = {},
                            wcl_5_list = [],
                            wcl_6 = {},
                            annexture_1 = {},
                            //
                            ref_num,
                            status,
                            claim_status,
                            message_list_provider = []
                        }
                    } = v;

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

                    const {
                        //1. Employer Details
                        company_name,
                        company_reg_num,
                        company_contact_person,
                        company_str_addr,
                        company_str_addr_code,
                        company_postal_addr,
                        company_postal_addr_code,
                        company_tel_code,
                        company_tel_num,
                        company_fax_code,
                        company_fax_num,
                        company_email,
                        company_location,
                        company_nature,

                        //2. Employee Details
                        company_employee_association,
//            employee,
                        doc_certified_id,
                        id_num,
                        dob,
                        gender,
                        marital_status,
                        citizen_of,
                        personnel_num,
                        occupation,
                        employee_str_addr,
                        employee_str_addr_code,
                        employee_postal_addr,
                        employee_postal_addr_code,
                        employee_tel_code,
                        employee_tel_num,
                        period_employ_years,
                        period_employ_months,
                        expected_disablement_period,

                        //3. Accident Details
                        //            incident_source,
                        //            incident,
//            accident_date,
                        accident_time,
                        incident_place,
                        incident_place_province,
                        incident_place_district,
                        accident_date_reported,
                        accident_time_reported,
                        task_employee_performing_during_accident,
                        period_experience_task_performed_years,
                        period_experience_task_performed_months,
                        employee_action_connected_business,
                        accident_desc,
                        traffic_accident_on_public_road,
                        nature_of_injury_list,
                        nature_of_injury_options,
                        employee_injured_explanation_satisfactory,
                        employee_injured_explanation_satisfactory_nope_desc,

                        //4. Further Particulars Of Employee
                        doc_salary_slip,
                        earning_list,
                        prepared_further_payments_after_3_months_4rm_accident_date,
                        total_amount_already_paid,
                        period_payments_made_range,
                        num_of_week_days_worked_by_employee,
                        date_ceased_work,
                        time_ceased_work,
                        did_employee_complete_shift_on_date_work_ceased,
                        date_resumed_work,
                        time_resumed_work,
                        dependant_name,
                        dependant_address,

                        //5. Further Particulars
                        previously_received_compensation_full_names,
                        was_1st_aid_given,
                        medical_practitioner_or_chiropractor_who_treated_employee,
                        hospital_which_treated_employee,
                        was_accidnt_caused_by_employee_options_1,
                        was_accidnt_caused_by_employee_options_2,
                        was_accidnt_caused_by_employee_options_3,
                        accident_witness,
                        accident_aware_person,
                        num_of_employees_involved_in_accident,
                        accident_police_station,
                        accident_docket_num,
                        involved_vehicle_reg_numbers,
                        contributing_factor_list_A,
                        contributing_factor_list_B,
                        other_machinery_list,
                        other_contributing_factor_list,
                        additional_details_or_comments,

                        //6. Employer's Declaration
                        employer_signature,
                        employer_signature_name,
                        employer_signature_date
                    } = wcl_2;

                    const {
                        employee_left_my_service_date,
                        periods_employee_light_duty
                    } = wcl_6;

                    const hasWCl = (v, counter) => {
                        if (!v)
                            return 'No';
                        if ((isArray(v) || isObservableArray(v)) && v.isEmpty())
                            return 'No';
                        if (isObject(v) && Object.keys(v).isEmpty())
                            return 'No';
                        if (isObject(v) && (v.dlUrls || v.wcl_2_external_doc || v.wcl_4_external_doc || v.wcl_6_external_doc))
                            return 'Yes';
                        if (!counter) {
                            return 'Yes';
                        }
                        const {count, max} = counter;
                        const perc = parseFloat(count / max).toFixed(0);
                        if (count === max) {
                            return 'Yes';
                        }
                        if (count > 0 && count < max) {
                            return 'Yes';//orange
                        }
                        if (count === 0) {
                            return 'No';
                        }
                        return 'No';
                    };

                    const calcLightDutyFromAndTo = (periods_employee_light_duty) => {
                        if (!isArray(periods_employee_light_duty)) {
                            return null;
                        }
                        periods_employee_light_duty.map(v => v.date_from).sort();
                        const from = periods_employee_light_duty[0];
                        const to = periods_employee_light_duty.getLastElement();
                        return {from: formatDate(from), to: formatDate(to)};
                    };

                    const {
                        from: periods_employee_light_duty_from,
                        to: periods_employee_light_duty_to
                    } = calcLightDutyFromAndTo(periods_employee_light_duty) || {};

                    const calcBeenFitForNormalDuty = (wcl_5_list) => {
                        if (wcl_5_list.isEmpty()) {
                            return '';
                        }
                        const wcl_5 = wcl_5_list.find(v => !!v.employee_been_fit_normal_work_date);
                        if (!wcl_5) {
                            return '';
                        }
                        const {employee_been_fit_normal_work_date} = wcl_5;
                        return formatDate(employee_been_fit_normal_work_date);
                    };
                    const calcHasProgressReport = (wcl_5_list) => {
                        if (wcl_5_list.isEmpty()) {
                            return 'No';
                        }
                        const wcl_5 = wcl_5_list.find(v => !v.employee_been_fit_normal_work_date && !!v.employee_likely_to_be_fit_normal_work_date);
                        return !wcl_5 ? 'No' : 'Yes';
                    };
                    const calcHasFinalReport = (wcl_5_list) => {
                        if (wcl_5_list.isEmpty()) {
                            return 'No';
                        }
                        const wcl_5 = wcl_5_list.find(v => !!v.employee_been_fit_normal_work_date);
                        return !wcl_5 ? 'No' : 'Yes';
                    };

                    const val = {
                        'Ref #': ref_num,
                        "Business Name": company_name,
                        "CF Register No.": company_reg_num,
                        "Claim No.": claim_number,
                        "Gender": gender,
                        "First Name": employee.fname || employee.data.fname,
                        "Last Name": employee.lname || employee.data.lname,
                        'ID / Passport No.': id_num,
                        'Injury / Disease / Fatal': hasWCl(wcl_2) === 'Yes' ? 'Injury' : '', //TODO: how to get fatal or disease
                        "Claim Status": claim_status,
                        "Occupation": getJobCategory(occupation),
                        'Progress - Requirments': '',
                        'Date of Accident': formatDate(accident_date),
                        'Book off': formatDate(employee_left_my_service_date), //wcl6
                        'Light Duty From': periods_employee_light_duty_from || '', //wcl6
                        'Light Duty To': periods_employee_light_duty_to || '', //wcl6
                        'Fit for Duty': calcBeenFitForNormalDuty(wcl_5_list), //wcl5
                        'Days Off': '',
                        'Place of Accident': incident_place,
                        'Accident Detais as per WCI.2 - Employers Report': accident_desc,
                        'Injury Type': [...(nature_of_injury_list || []).filter(v => !!v), ...(nature_of_injury_options || []).filter(v => !!v)].join(', '),
                        'Employer WCI.2': hasWCl(wcl_2),
                        'Certified ID': !!doc_certified_id ? 'Yes' : 'No',
                        'Salary Slip': !!doc_salary_slip ? 'Yes' : 'No',
                        '1st Report': hasWCl(wcl_4),
                        'Progress Report': calcHasProgressReport(wcl_5_list),
                        'Final Report': calcHasFinalReport(wcl_5_list),
                        'Resumption Report': hasWCl(wcl_6)
                    };

                    return val;
                });

                return await this.export_excel_impl(loggedUser, "ClaimsClient-Management-Docs", "ClaimsClient-Management-ServiceProvider", "ClaimsClient-Management Data", cols, rows);
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    company: {id: receipient_coid_provider_id, data: {consultant}},
                    client_id
                } = loggedUser;

                receipient_coid_provider_id = client_id || receipient_coid_provider_id;

                const {date_range, client_id: from_client_id, isNew} = filterData;

                let list = await AControllerRead.prototype.listImpl.call(this, evt, {
                    isNew,
                    limit: -1,
                    direction: 'desc'
                }, q => {
                    q = q.where('receipient_coid_provider_id', '==', receipient_coid_provider_id);
                    if (from_client_id) {
                        q = q.where('client_id', '==', from_client_id);
                    }
                    if (date_range) {
                        const {start, end} = date_range;
                        if (start) {
                            q = q.where('accident_date', '>=', start);
                        }
                        if (end) {
                            q = q.where('accident_date', '<=', end);
                        }
                    }
                    return q;
                });
                list = await Promise.all(list.map(mapResults.bind(this)));
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}, filter) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    company: {id: receipient_coid_provider_id, data: {consultant}},
                    client_id, project_id, site_id
                } = loggedUser;

                receipient_coid_provider_id = client_id || receipient_coid_provider_id;

                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    q = q.where('receipient_coid_provider_id', '==', receipient_coid_provider_id);
                    filter && (q = filter(q));
                    return q;
                });

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

        sortBy() {
            return "ref_num";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item) {
        let {
            id,
            data: {
                employee_id,
                wcl_2,
                client, project, site, client_id, project_id, site_id,
                receipient_coid_provider_id
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
        if (receipient_coid_provider_id) {
            promise.push(Events.get('plugin_sheq_assist/COIDA_Management/companies/coid-provider/').then(cntr => {
                return cntr.find_by_id.call(cntr, null, receipient_coid_provider_id);
            }).then(val => {
                if (val) {
                    item.data.receipient_coid_provider = val;
                }
            }));
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
