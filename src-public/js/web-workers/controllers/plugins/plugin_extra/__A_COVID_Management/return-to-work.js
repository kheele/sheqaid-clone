
(() => {
    class Controller extends ACasesController {
        //audit_findings, audit_summary, possible_score, achieved_score
        constructor(events) {
            super(events, {singular: "COVID Management Return To Work Case", plural: "COVID Management Return To Work Cases"}, "plugin_sheq_assist/COVID_Management/return-to-work/", "plugin_sheq_assist_COVID_Management_return-to-work");

            this.notification_key = "receive_covid_return_to_work_notifs";
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
                    {header: 'EmployeeID/SAID/Passport number', key: 'EmployeeID/SAID/Passport number', width: 35},
                    {header: 'EmployeeWorkID', key: 'EmployeeWorkID', width: 35},
                    {header: 'BusinessID', key: 'BusinessID', width: 35},
                    {header: 'Date', key: 'Date', width: 35},
                    {header: 'Province', key: 'Province', width: 35},
                    {header: 'District', key: 'District', width: 35},
                    {header: 'Industry', key: 'Industry', width: 35},
                    {header: 'Job category', key: 'Job category', width: 35},

                    {header: 'Hospitalized', key: 'Hospitalized', width: 35},
                    {header: 'Hospital Type (Private/Public)', key: 'Hospital Type (Private/Public)', width: 35},
                    {header: 'If Hospitalised: Date of admission', key: 'If Hospitalised: Date of admission', width: 35},
                    {header: 'Outcome (Discharge or Death)', key: 'Outcome (Discharge or Death)', width: 35},
                    {header: 'Outcome date', key: 'Outcome date', width: 35},
                    {header: 'Return to work date', key: 'Return to work date', width: 35},
                    {header: 'Return to work fitness level', key: 'Return to work fitness level', width: 35},
                    {header: 'Compensation claim', key: 'Compensation claim', width: 35},
                    {header: 'Percentage disablement', key: 'Percentage disablement', width: 35},
                    {header: 'Start date of illness', key: 'Start date of illness', width: 35},
                    {header: 'Illness type', key: 'Illness type', width: 35},
                    {header: 'End date of illness', key: 'End date of illness', width: 35},
                    {header: 'COID Claim reference number', key: 'COID Claim reference number', width: 35}
                ];

//                employee: {id, fname, lname}, employee_id, business_id, date: date.getTime(), sex, age, province, district, job_category,
//                hospitalised, outcome, outcome_date: outcome_date.getTime(), return_to_work_date: return_to_work_date.getTime(), return_to_work_fitness
//                if(hospital_type) {
//                    data.hospital_type = hospital_type;
//                }
//                if(admission_date) {
//                    data.admission_date = admission_date.getTime();
//                }
//                if(compensation_claim) {
//                    data.compensation_claim = compensation_claim;
//                }
//                if(percentage_disablement) {
//                    data.percentage_disablement = percentage_disablement;
//                }
//                if(claim_ref_num) {
//                    data.claim_ref_num = claim_ref_num;
//                }
                const rows = list.map(({id, data: {
                business_id: __business_id, employee, employee_id, sex, age, date, province, district, industry, job_category,
                        hospitalised, outcome, outcome_date, return_to_work_date, return_to_work_fitness,
                        hospital_type, admission_date, compensation_claim, percentage_disablement, claim_ref_num,
                        illness_start_date, illness_type, illness_end_date
                }}) => {
                    const employee_uid = employee.id;
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
                            "EmployeeWorkID": employee_uid || "",
                            "JobCategory": getJobCategory(job_category),
                            "Industry": industry || "",
                            "Province": province || "",
                            "District": district || "",
                            "Date": formatDate(date),
                            "Hospitalised": hospitalised || "",
                            "HospitalType": hospital_type || "",
                            "DateAdmission": formatDate(admission_date),
                            "Outcome": outcome || "",
                            "OutcomeDate": formatDate(outcome_date),
                            "ReturntoWorkDate": formatDate(return_to_work_date),
                            "ReturnToWorkFitness": return_to_work_fitness,
                            "CompensationClaim": compensation_claim || "",
                            "Disablement": percentage_disablement || "",
                            "ClaimREfNo": claim_ref_num || "",
                            "StartDateOfIllness": formatDate(illness_start_date),
                            "IllnessType": illness_type || "",
                            "EndDateOfIllness": formatDate(illness_end_date),
                            "Update": 0
                        };
                    } else {
                        val = {
                            "EmployeeID/SAID/Passport number": employee_id,
                            EmployeeWorkID: employee_uid,
                            'BusinessID': business_id || __business_id,
                            Date: formatDate(date),
                            Province: province,
                            District: district,
                            Industry: industry,
                            'Job category': getJobCategory(job_category),

                            Hospitalized: hospitalised,
                            'Hospital Type (Private/Public)': hospital_type || "",
                            'If Hospitalised: Date of admission': formatDate(admission_date),
                            'Outcome (Discharge or Death)': outcome,
                            "Outcome date": formatDate(outcome_date),
                            'Return to work date': formatDate(return_to_work_date),
                            "Return to work fitness level": return_to_work_fitness,
                            'Compensation claim': compensation_claim || '',
                            "Percentage disablement": percentage_disablement || '',
                            "Start date of illness": formatDate(illness_start_date),
                            "Illness type": illness_type || '',
                            "End date of illness": formatDate(illness_end_date),
                            'COID Claim reference number': claim_ref_num || ''
                        };
                    }
                    return val;
                });


                if (type === "API") {
                    return rows;
                } else {
                    return await this.export_excel_impl(loggedUser, "COVID-Docs", "ReturnToWorkCase", "Return To Work Case Data", cols, rows);
                }
            });
        }
    }

    new Controller(events);
})();