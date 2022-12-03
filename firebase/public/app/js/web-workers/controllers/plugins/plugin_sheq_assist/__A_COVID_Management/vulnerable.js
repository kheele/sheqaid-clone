
(() => {
    class Controller extends ACasesController {
        //audit_findings, audit_summary, possible_score, achieved_score
        constructor(events, db) {
            super(events, db, {singular: "COVID Management Vulnerability Case", plural: "COVID Management Vulnerability Cases"}, "plugin_sheq_assist/COVID_Management/vulnerable/", "plugin_sheq_assist_COVID_Management_vulnerable");
        
            this.notification_key = "receive_covid_vulnerability_notifs";
        }

        async export_excel(evt, date_range) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await this.list(evt);
                const {date_from, date_to} = date_range;
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
                    {header: 'Employee names', key: 'Employee names', width: 35},
                    {header: 'EmployeeID (SANationalID/BusinessGenID)', key: 'EmployeeID (SANationalID/BusinessGenID)', width: 35},
                    {header: 'BusinessID', key: 'BusinessID', width: 35},
                    {header: 'Date', key: 'Date', width: 35},
                    {header: 'Province', key: 'Province', width: 35},
                    {header: 'District', key: 'District', width: 35},
                    {header: 'Sex', key: 'Sex', width: 35},
                    {header: 'Age', key: 'Age', width: 35},
                    {header: 'JobCategory', key: 'JobCategory', width: 35},

                    {header: 'Vulnerability status', key: 'Vulnerability status', width: 35},
                    {header: 'Asthma', key: 'Asthma', width: 35},
                    {header: 'Chronic Lung Disease', key: 'Chronic Lung Disease', width: 35},
                    {header: 'Diabetes', key: 'Diabetes', width: 35},
                    {header: 'Hypertension', key: 'Hypertension', width: 35},
                    {header: 'SeriousHeartConditions', key: 'SeriousHeartConditions', width: 35},
                    {header: 'ChronicKidneyDisease', key: 'ChronicKidneyDisease', width: 35},
                    {header: 'ChronicLiverDisease', key: 'ChronicLiverDisease', width: 35},
                    {header: 'Immunocompromised', key: 'Immunocompromised', width: 35},
                    {header: 'PreviousTuberculosis', key: 'PreviousTuberculosis', width: 35},
                    {header: 'CurrentTuberculosis', key: 'CurrentTuberculosis', width: 35},
                    {header: 'HIV', key: 'HIV', width: 35},
                    {header: 'Age=>60 years', key: 'Age=>60 years', width: 35},
                    {header: 'Smoking current', key: 'Smoking current', width: 35},
                    {header: 'Pregnancy => 28 weeks', key: 'Pregnancy => 28 weeks', width: 35},
                    {header: 'Obesity', key: 'Obesity', width: 35},
                    {header: 'Received flu vaccine', key: 'Received flu vaccine', width: 35}
                ];

//                const {employee: {id, data: {fname, lname}}, employee_id, business_id, date, sex, age, province, district, job_category, vulnerability_status} = form.data;
//                const data = {
//                    employee: {id, fname, lname}, employee_id, business_id, date: date.getTime(), sex, age, province, district, job_category, vulnerability_status
//                };
//
//                if (checklist) {
//                    data.checklist = checklist;
//                }

                const rows = list.map(({id, data: {
                employee, employee_id, business_id, date, sex, age, province, district, job_category, vulnerability_status, checklist
                }}) => {
                    const findChecklist = key => {
                        if (checklist && Array.isArray(checklist)) {
                            const res = checklist.find(v => v.text === key);
                            if (res) {
                                return res.status;
                            }
                        }
                        return "";
                    };
                    return {
                        "Employee names": employee.fname + ' ' + employee.lname,
                        "EmployeeID (SANationalID/BusinessGenID)": employee_id,
                        BusinessID: business_id,
                        Date: new Date(date),
                        Province: province,
                        District: district,
                        Sex: sex,
                        Age: age,
                        JobCategory: job_category ? job_category.name || job_category : null,

                        "Vulnerability status": vulnerability_status,
                        Asthma: findChecklist("Asthma"),
                        "Chronic Lung Disease": findChecklist("Chronic Lung Disease"),
                        Diabetes: findChecklist("Diabetes"),
                        Hypertension: findChecklist("Hypertension"),
                        SeriousHeartConditions: findChecklist("Serious Heart Conditions"),
                        ChronicKidneyDisease: findChecklist("Chronic Kidney Disease"),
                        ChronicLiverDisease: findChecklist("Chronic Liver Disease"),
                        Immunocompromised: findChecklist("Immunocompromised"),
                        PreviousTuberculosis: findChecklist("Previous Tuberculosis"),
                        CurrentTuberculosis: findChecklist("Current Tuberculosis"),
                        HIV: findChecklist("HIV"),
                        "Age=>60 years": findChecklist("Age => 60 years"),
                        "Smoking current": findChecklist("Smoking current"),
                        "Pregnancy => 28 weeks": findChecklist("Pregnancy => 28 weeks"),
                        Obesity: findChecklist("Obesity"),
                        "Received flu vaccine": findChecklist("Received Flu Vaccine")
                    };
                });

                return await this.export_excel_impl(loggedUser, "COVID-Docs", "VulnerabilityCase", "Vulnerability Case Data", cols, rows);
            });
        }
    }

    new Controller(events, db);
})();