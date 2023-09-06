
(() => {
    class Controller extends ACasesController {
        //audit_findings, audit_summary, possible_score, achieved_score
        constructor(events) {
            super(events, {singular: "COVID Management Screening", plural: "COVID Management Screenings"}, "plugin_sheq_assist/COVID_Management/screening/", "plugin_sheq_assist_COVID_Management_screening");

            this.notification_key = "receive_covid_screening_notifs";

//            this.exec(evt);
        }

//        async exec(evt) {
//            var q2 = this.getDB().collection("plugin_sheq_assist_COVID_Management_screening").
//                    where('client_id', '==', 'xsgHS89lCfve5qdsCiGy').//xsgHS89lCfve5qdsCiGy = Kwikbuild Cement
//                    where('project_id', '==', 'YgbDWnpRd6Xj851pI0yp');//YgbDWnpRd6Xj851pI0yp = Kwikbuild Cement Kya Sand
////                    where('site_id', '!=', 'MCZtEou5R68mnAr55fCS');//MCZtEou5R68mnAr55fCS = Kwikbuild Cement.
//            const querySnapshot2 = await q2.get();
//            querySnapshot2.forEach(async function (doc) {
//                await doc.ref.update({site_id: 'MCZtEou5R68mnAr55fCS'});
//                console.log('updated', doc.ref.id)
//            });
//        }

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
    }

    new Controller(events);
})();