
(() => {
    class Controller extends ACasesController {
        //audit_findings, audit_summary, possible_score, achieved_score
        constructor(events, db) {
            super(events, db, {singular: "COVID Management Vulnerability Case", plural: "COVID Management Vulnerability Cases"}, "plugin_sheq_assist/COVID_Management/vulnerable/", "plugin_sheq_assist_COVID_Management_vulnerable");

            this.notification_key = "receive_covid_vulnerability_notifs";
        }

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
                    {header: 'EmployeeID/SAID*/Passport number', key: 'EmployeeID/SAID*/Passport number', width: 35},
                    {header: 'BusinessID', key: 'BusinessID', width: 35},
                    {header: 'Date', key: 'Date', width: 35},
                    {header: 'Province', key: 'Province', width: 35},
                    {header: 'District', key: 'District', width: 35},
                    {header: 'Industry', key: 'Industry', width: 35},
                    {header: 'Age', key: 'Age', width: 35},
                    {header: 'Sex', key: 'Sex', width: 35},
                    {header: 'Job category', key: 'Job category', width: 35},

                    {header: 'Vulnerability Status', key: 'Vulnerability Status', width: 35},
                    {header: 'Asthma', key: 'Asthma', width: 35},
                    {header: 'Chronic Lung Disease', key: 'Chronic Lung Disease', width: 35},
                    {header: 'Diabetes', key: 'Diabetes', width: 35},
                    {header: 'Hypertension', key: 'Hypertension', width: 35},
                    {header: 'Serious heart conditions', key: 'Serious heart conditions', width: 35},
                    {header: 'Chronic Kidney Disease', key: 'Chronic Kidney Disease', width: 35},
                    {header: 'Chronic Liver Disease', key: 'Chronic Liver Disease', width: 35},
                    {header: 'Immunocompromised', key: 'Immunocompromised', width: 35},
                    {header: 'Tuberculosis previous', key: 'Tuberculosis previous', width: 35},
                    {header: 'Tuberculosis current', key: 'Tuberculosis current', width: 35},
                    {header: 'HIV', key: 'HIV', width: 35},
                    {header: 'Age ≥60 years', key: 'Age ≥60 years', width: 35},
                    {header: 'Smoking current', key: 'Smoking current', width: 35},
                    {header: 'Pregnancy ≥28 weeks', key: 'Pregnancy ≥28 weeks', width: 35},
                    {header: 'Obesity (measured by obtaining Height and Weight of employee) or BMI >30', key: 'Obesity (measured by obtaining Height and Weight of employee) or BMI >30', width: 35},
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
                employee, employee_id, business_id: __business_id, date, sex, age, province, district, industry, job_category, vulnerability_status, checklist
                }}) => {
                    const employee_uid = employee.id;
                    const findChecklist = key => {
                        if (checklist && Array.isArray(checklist)) {
                            const res = checklist.find(v => v.text === key);
                            if (res) {
                                return res.status;
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
                            "Date": formatDate(date),
                            "Province": province || "",
                            "District": district || "",
                            "Industry": industry || "",
                            "Age": String(age || ""),
                            "Sex": sex || "",
                            "JobCategory": getJobCategory(job_category),
                            "VulnerabilityStatus": vulnerability_status || "",
                            "Asthma": findChecklist("Asthma"),
                            "ChronicLungDisease": findChecklist("Chronic Lung Disease"),
                            "Diabetes": findChecklist("Diabetes"),
                            "Hypertension": findChecklist("Hypertension"),
                            'SeriousHeartConditions': findChecklist("Serious Heart Conditions"),
                            'ChronicKidneyDisease': findChecklist("Chronic Kidney Disease"),
                            'ChronicLiverDisease': findChecklist("Chronic Liver Disease"),
                            "Immunocompromised": findChecklist("Immunocompromised"),
                            'PreviousTuberculosis': findChecklist("Previous Tuberculosis"),
                            'CurrentTuberculosis': findChecklist("Current Tuberculosis"),
                            "HIV": findChecklist("HIV"),
                            "AgeAbove60years": findChecklist("Age => 60 years"),
                            "SmokingCurrent": findChecklist("Smoking current"),
                            "PregnancyAbove28weeks": findChecklist("Pregnancy => 28 weeks"),
                            'Obesity': findChecklist("Obesity"),
                            "ReceivedFluVaccine": findChecklist("Received Flu Vaccine"),
                            "Update": 0
                        };
                    } else {
                        val = {
                            "EmployeeID/SAID*/Passport number": employee_id,
                            'BusinessID': business_id || __business_id,
                            Date: formatDate(date),
                            Province: province,
                            District: district,
                            Industry: industry,
                            Age: age,
                            Sex: sex,
                            'Job category': getJobCategory(job_category),

                            "Vulnerability Status": vulnerability_status,
                            Asthma: findChecklist("Asthma"),
                            "Chronic Lung Disease": findChecklist("Chronic Lung Disease"),
                            Diabetes: findChecklist("Diabetes"),
                            Hypertension: findChecklist("Hypertension"),
                            'Serious heart conditions': findChecklist("Serious Heart Conditions"),
                            'Chronic Kidney Disease': findChecklist("Chronic Kidney Disease"),
                            'Chronic Liver Disease': findChecklist("Chronic Liver Disease"),
                            Immunocompromised: findChecklist("Immunocompromised"),
                            'Tuberculosis previous': findChecklist("Previous Tuberculosis"),
                            'Tuberculosis current': findChecklist("Current Tuberculosis"),
                            HIV: findChecklist("HIV"),
                            "Age ≥60 years": findChecklist("Age => 60 years"),
                            "Smoking current": findChecklist("Smoking current"),
                            "Pregnancy ≥28 weeks": findChecklist("Pregnancy => 28 weeks"),
                            'Obesity (measured by obtaining Height and Weight of employee) or BMI >30': findChecklist("Obesity"),
                            "Received flu vaccine": findChecklist("Received Flu Vaccine")
                        };
                    }
                    return val;
                });


                if (type === "API") {
                    return rows;
                } else {
                    return await this.export_excel_impl(loggedUser, "COVID-Docs", "VulnerabilityCase", "Vulnerability Case Data", cols, rows);
                }
            });
        }
    }

    new Controller(events, db);
})();