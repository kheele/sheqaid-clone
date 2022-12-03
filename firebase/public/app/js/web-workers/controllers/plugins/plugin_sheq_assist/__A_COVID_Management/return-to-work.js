
(() => {
    class Controller extends ACasesController {
        //audit_findings, audit_summary, possible_score, achieved_score
        constructor(events, db) {
            super(events, db, {singular: "COVID Management Return To Work Case", plural: "COVID Management Return To Work Cases"}, "plugin_sheq_assist/COVID_Management/return-to-work/", "plugin_sheq_assist_COVID_Management_return-to-work");
        
            this.notification_key = "receive_covid_return_to_work_notifs";
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
                
                if(list.isEmpty()) {
                    return "EMPTY";
                }

                const cols = [
                    {header: 'EmployeeID (SANational/BusinessGenerated)', key: 'EmployeeID (SANational/BusinessGenerated)', width: 35},
                    {header: 'BusinessID', key: 'BusinessID', width: 35},
                    {header: 'Date', key: 'Date', width: 35},
                    {header: 'Province', key: 'Province', width: 35},
                    {header: 'District', key: 'District', width: 35},
                    {header: 'Jobcategorisation', key: 'Jobcategorisation', width: 35},

                    {header: 'Hospitalised', key: 'Hospitalised', width: 35},
                    {header: 'HospitalType', key: 'HospitalType', width: 35},
                    {header: 'DateAdmission', key: 'DateAdmission', width: 35},
                    {header: 'Outcome', key: 'Outcome', width: 35},
                    {header: 'Outcome(discharge,death)Date', key: 'Outcome(discharge,death)Date', width: 35},
                    {header: 'ReturntoWorkDate', key: 'ReturntoWorkDate', width: 35},
                    {header: 'ReturnToWork Fitness ', key: 'ReturnToWork Fitness ', width: 35},
                    {header: 'CompensationClaim', key: 'CompensationClaim', width: 35},
                    {header: '%Disablement', key: '%Disablement', width: 35},
                    {header: 'ClaimREfNo', key: 'ClaimREfNo', width: 35}
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
                business_id, employee_id, sex, age, date, province, district, job_category,
                        hospitalised, outcome, outcome_date, return_to_work_date, return_to_work_fitness,
                        hospital_type, admission_date, compensation_claim, percentage_disablement, claim_ref_num
                }}) => {
                    return {
                        "EmployeeID (SANational/BusinessGenerated)": employee_id,
                        BusinessID: business_id,
                        Date: new Date(date),
                        Province: province,
                        District: district,
                        Jobcategorisation: job_category ? job_category.name || job_category : null,

                        Hospitalised: hospitalised,
                        HospitalType: hospital_type || "",
                        DateAdmission: admission_date ? new Date(admission_date) : "",
                        Outcome: outcome,
                        "Outcome(discharge,death)Date": new Date(outcome_date),
                        ReturntoWorkDate: new Date(return_to_work_date),
                        "ReturnToWork Fitness": return_to_work_fitness,
                        CompensationClaim: compensation_claim || '',
                        "%Disablement": percentage_disablement || '',
                        ClaimREfNo: claim_ref_num || ''
                    };
                });

                return await this.export_excel_impl(loggedUser, "COVID-Docs", "ReturnToWorkCase", "Return To Work Case Data", cols, rows);
            });
        }
    }

    new Controller(events, db);
})();