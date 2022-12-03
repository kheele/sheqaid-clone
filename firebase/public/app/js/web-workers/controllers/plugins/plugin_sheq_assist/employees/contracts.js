
(() => {
    class Controller extends AEmployeeDocsController {
        constructor(events, db) {
            super(
                    events,
                    db,
                    {singular: "Employee Contract", plural: "Employees Contracts"},
                    "plugin_sheq_assist/employees/contracts/"
                    );

//            addAction("export_excel_by_employee", this.export_excel_by_employee.bind(this));

            this.collectionGroup = "employee_contract_list";
        }

        async create(evt, data) {
            return AEmployeeDocsController.prototype.create.call(this, evt, data, async (genId, data) => {
                const {job_profile_doc, employee: {id: employee_id}} = data;
                if (job_profile_doc) {
                    const gcsUri = await files.upload.call(this, job_profile_doc, async bucketFile => {
                        const name = fileUtils.getFileName(job_profile_doc).replaceAll(' ', '_');
                        const new_name = this.tbl + '/' + employee_id + '/' + this.collectionGroup + '/job_profile_doc/' + genId + '/' + name;
                        return new_name;
                    }).catch(e => {
                        throw e;
                    });
                    data.job_profile_doc = gcsUri;
                }
            });
        }

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Start Date', key: 'Start Date', width: 20},
                    {header: 'End Date', key: 'End Date', width: 20},
                    {header: 'End Of Trial Period', key: 'End Of Trial Period', width: 20},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Start Time', key: 'Start Time', width: 20},
                    {header: 'End Time', key: 'End Time', width: 20},
                    {header: 'Daily Working Hours', key: 'Daily Working Hours', width: 20},
                    {header: 'Notes', key: 'Notes', width: 35},
                    {header: 'Payment Type', key: 'Payment Type', width: 25},
                    {header: 'Salary Interval', key: 'Salary Interval', width: 25},
                    {header: 'Salary', key: 'Salary', width: 25},
                    {header: 'Wage', key: 'Wage', width: 25},
                    {header: 'Deductibles', key: 'Deductibles', width: 40},
                    {header: 'Deductibles Total', key: 'Deductibles Total', width: 40},
                    {header: 'Contract Document Attachment', key: 'Contract Document Attachment', width: 45},
                    {header: 'Job Profile Document Attachment', key: 'Job Profile Document Attachment', width: 45}
                ];

                const {
                    fname, lname,
                    employee_contract_list, sub_collection_keys: {
                        employee_contract_list: {latest, id: ids}
                    }
                } = employee.data;

                let list = Object.keys(employee_contract_list).map(id => {
                    return {id, expiry_date: employee_contract_list[id].expiry_date || null};
                });
                list.sortBy('expiry_date', 'desc');
                list = list.map(({id, expiry_date}) => {
                    return {id, data: employee_contract_list[id]};
                });

                console.log(evt, list)

                const rows = list.map(({id, data: {
                created_at, salary_info, contract_details, doc, job_profile_doc
                }}) => {
                    console.log('test contracts export doc job_profile_doc', doc, job_profile_doc)

                    let expiry, isTrial;
                    if (contract_details) {
                        const {expiry_date, end_of_trial_period} = contract_details;
                        if (expiry_date) {
                            expiry = expiry_date;
                        } else if (end_of_trial_period) {
                            expiry = end_of_trial_period;
                            isTrial = true;
                        }
                    }

                    const calculateDeductiblesTotal = () => {
                        const list = (salary_info.deductible && salary_info.deductible.list || []);
                        const l = list.filter(({text, value}) => text && value).map(({value}) => value);
                        const total = l.reduce((n1, n2) => n1 + n2, 0);
                        return total.toCurrency('R');
                    };
                    const res = {
                        "Start Date": contract_details && contract_details.start_date ? new Date(contract_details.start_date) : "N/A",
                        "End Date": contract_details && contract_details.expiry_date ? new Date(contract_details.expiry_date) : "N/A",
                        "End Of Trial Period": contract_details && contract_details.end_of_trial_period ? new Date(contract_details.end_of_trial_period) : "N/A",
                        "Start Time": contract_details && contract_details.start_time || "N/A",
                        "End Time": contract_details && contract_details.end_time || "N/A",
                        "Daily Working Hours": contract_details && contract_details.daily_working_hours || "N/A",
                        "Notes": contract_details && contract_details.notes || "N/A",
                        "Payment Type": salary_info.payment_type || "N/A",
                        "Salary Interval": salary_info.salary_interval || "N/A",
                        "Salary": salary_info.salary || "N/A",
                        "Wage": salary_info.wage || "N/A",
                        "Deductibles": salary_info.deductible && salary_info.deductible.list ? salary_info.deductible.list.map(v => {
                            return v.text + " = " + v.value.toCurrency('R');
                        }) : "N/A",
                        "Deductibles Total": salary_info.deductible && salary_info.deductible.list ? calculateDeductiblesTotal() : "N/A",
                        "Contract Document Attachment": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A",
                        "Job Profile Document Attachment": job_profile_doc && job_profile_doc.dlUrls ? job_profile_doc.dlUrls[0] : "N/A"
                    };
                    return res;
                });

                const name = lname + " " + fname;
                const folder = "Contracts";
                return await this.export_excel_impl(
                        loggedUser,
                        "Employee-Docs/Employees-Active/" + folder.replace(" ", "-"),
                        name.replaceAll(" ", "-"),
                        name + " " + folder,
                        cols,
                        rows);
            });
        }
        // </editor-fold>

//        sub_collection_keys(data) {
//            return null;
//        }

        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData);
        }

    }

    new Controller(events, db);
})();