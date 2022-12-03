
(() => {
    class Controller extends ACasesController {
        //audit_findings, audit_summary, possible_score, achieved_score
        constructor(events, db) {
            super(events, db, {singular: "COVID Management Screening", plural: "COVID Management Screenings"}, "plugin_sheq_assist/COVID_Management/screening/", "plugin_sheq_assist_COVID_Management_screening");
        
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
                let list = await this.list(evt);
                const {date_from, date_to, type} = date_range;
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

                if (list.isEmpty()) {
                    return "EMPTY";
                }

                const cols = [
                    {header: 'BusinessID', key: 'BusinessID', width: 35},
                    {header: 'ConsentO', key: 'ConsentO', width: 35},
                    {header: 'EmployeedID (SANational/BusinessGen)', key: 'EmployeedID (SANational/BusinessGen)', width: 35},
                    {header: 'ScreeningDate', key: 'ScreeningDate', width: 35},
                    {header: 'Province', key: 'Province', width: 35},
                    {header: 'District', key: 'District', width: 35},
                    {header: 'Employee Gender', key: 'Employee Gender', width: 35},
                    {header: 'Employee Age', key: 'Employee Age', width: 35},
                    {header: 'Job Category', key: 'Job Category', width: 35},

                    {header: 'SymptomsStatus', key: 'SymptomsStatus', width: 35},
                    {header: 'Fever', key: 'Fever', width: 35},
                    {header: 'Chills', key: 'Chills', width: 35},
                    {header: 'Dry Cough', key: 'Dry Cough', width: 35},
                    {header: 'Sore Throat', key: 'Sore Throat', width: 35},
                    {header: 'Shortness of Breath', key: 'Shortness of Breath', width: 35},
                    {header: 'Tiredness', key: 'Tiredness', width: 35},
                    {header: 'Lack of smell or taste', key: 'Lack of smell or taste', width: 35},
                    {header: 'Conjuctivitis (Red Eyes)', key: 'Conjuctivitis (Red Eyes)', width: 35},
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

                cols.pushAll([
                    {header: 'ScreeningOutcome-no action required', key: 'ScreeningOutcome-no action required', width: 35},
                    {header: 'ScreeningOutcome-referred for self-isolation', key: 'ScreeningOutcome-referred for self-isolation', width: 35},
                    {header: 'ScreeningOutcome-referred for testing', key: 'ScreeningOutcome-referred for testing', width: 35},
                    {header: 'ScreeningOutcome-referred to the doctor', key: 'ScreeningOutcome-referred to the doctor', width: 35},
                ]);

//                const {employee: {id, data: {fname, lname}}, employee_id, consent, business_id, date, sex, age, province, district, job_category, outcome, symptoms_status} = form.data;
//                const data = {
//                    employee: {id, fname, lname}, employee_id, consent, business_id, date: date.getTime(), sex, age, province, district, job_category, outcome, symptoms_status
//                };
//
//                if (checklist) {
//                    data.checklist = checklist;
//                }

                const rows = list.map(({id, data: {
                    employee, employee_id, consent, business_id, date, sex, age, province, district, job_category, outcome, symptoms_status, checklist
                }}) => {
                    const findChecklist = key => {
                        if (checklist && Array.isArray(checklist)) {
                            const res = checklist.find(v => v.key === key);
                            if (res) {
                                if (key === "temperature") {
                                    return res.status > 37.5 ? "Yes" : "No";
                                } else {
                                    return res.status;
                                }
                            }
                        }
                        return "";
                    };
                    const val = {
                        BusinessID: business_id,
                        ConsentO: consent,
                        "EmployeedID (SANational/BusinessGen)": employee_id,
                        ScreeningDate: new Date(date),
                        Province: province,
                        District: district,
                        "Employee Gender": sex,
                        "Employee Age": age,
                        "Job Category": job_category ? job_category.name || job_category : null,

                        SymptomsStatus: symptoms_status,
                        Fever: findChecklist("temperature"),
                        Chills: findChecklist("chillis"),
                        "Dry Cough": findChecklist("dry_cough"),
                        "Sore Throat": findChecklist("sore_throat"),
                        'Shortness of Breath': findChecklist("shortness_of_breath"),
                        'Muscle pains': findChecklist("muscle_pains"),
                        Diarrhoea: findChecklist("diarrhea"),
                        Tiredness: findChecklist("tireness"),
                        'Conjuctivitis (Red Eyes)': findChecklist("redness_of_eye"),
                        'Lack of smell or taste': findChecklist("loss_of_smell_or_taste"),
                        'Nausea or vomiting': findChecklist("nausea_or_vomiting"),

                        Dizziness: findChecklist("dizziness"),
                        Headache: findChecklist("headache"),

                        'ScreeningOutcome-no action required': outcome === "No Action Required" ? "Yes" : "No",
                        'ScreeningOutcome-referred for self-isolation': outcome === "Referred For Self-Isolation" ? "Yes" : "No",
                        'ScreeningOutcome-referred for testing': outcome === "Referred For Testing" ? "Yes" : "No",
                        'ScreeningOutcome-referred to the doctor': outcome === "Referred To The Doctor" ? "Yes" : "No"
                    };
                    if (type === "Internal") {
                        val['Have you been in contact with someone with COVID-19?'] = findChecklist("in_contact_with_covid_patient");
                        val['Have you been traveling or been at the following locations: Doctor; High risk area or event in the last 14 days?'] = findChecklist("last_14_days_travelled");
                        val["Do you deem yourself medically fit and to the best of your knowledge you don't have COVID-19?"] = findChecklist("am_medically_fit");
                        val['Are you wearing a mask'] = findChecklist("are_you_wearing_a_mask");
                    } 
                    
                    return val;
                });

                return await this.export_excel_impl(loggedUser, "COVID-Docs", "Screening", "Screening Data", cols, rows);
            });
        }
    }

    new Controller(events, db);
})();