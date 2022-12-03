
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

            this.collectionGroup = "contract_list";
        }

        // <editor-fold defaultstate="collapsed" desc="create">
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
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Company', key: 'Company', width: 30},
                    {header: 'Project', key: 'Project', width: 30},
                    {header: 'Site', key: 'Site', width: 30},
                    
                    {header: 'Department', key: 'Department', width: 25},
                    {header: 'Job Position', key: 'Job Position', width: 25},

                    {header: 'First Name', key: 'First Name', width: 25},
                    {header: 'Last Name', key: 'Last Name', width: 25},
                    {header: 'Gender', key: 'Gender', width: 15},
                    {header: 'Phone No.', key: 'Phone No.', width: 15},
                    {header: 'Email Address', key: 'Email Address', width: 25},

                    {header: 'Contract Type', key: 'Contract Type', width: 20},
                    {header: 'Start Date', key: 'Start Date', width: 20},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'End Of Trial Period', key: 'End Of Trial Period', width: 20},
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

//                console.log('employeeList', list)

                const rows = await Promise.all(list.map(async employee => {
                    const {id,
                        data: {
                            created_at,
                            profile_pic,
                            fname, lname, id_num, passport_num, dob, sex,
                            client, project, site, phone, email,
                            //
                            optional_info = {},
                            documents,
                            next_of_kin_1, next_of_kin_2, dependants,
                            //
                            employee_contract_list = {},
                            employee_competency_list = {},
                            employee_medical_list = {},
                            employee_warning_list = {},
                            employee_leave_list = {},
                            //
                            training_certificate_list = []
                        }
                    } = employee;
                    
                    const {department, job_position} = optional_info;

                    const res = {
                        Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                        Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                        Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                        "Department": department ? (department.name || department.data.name) : "N/A",
                        "Job Position": job_position ? (job_position.name || job_position.data.name) : "N/A",

                        "First Name": fname,
                        "Last Name": lname,
                        Gender: sex || sex,
                        "Phone No.": phone ? String(phone) : "",
                        "Email Address": email || ""
                    };

                    {
//                        const employee_contracts_path = await Events.get('plugin_sheq_assist/employees/contracts/').then(tbl => {
//                            return tbl.export_excel_by_employee.call(tbl, null, employee);
//                        });
//                        res["Contracts"] = employee_contracts_path;
                        let list = Object.keys(employee_contract_list).map(id => {
                            return {id, expiry_date: employee_contract_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_contract_list[id]};
                        });

                        return list.map(item => {
                            const {data: {created_at, salary_info = {}, contract_details = {}, doc, job_profile_doc}} = item;
                            let {contract_type, start_date, expiry_date, end_of_trial_period, start_time, end_time, daily_working_hours, notes} = contract_details;
                            let {payment_type, salary_interval, salary = "N/A", wage, deductible = {}} = salary_info;
                            if (salary !== "N/A") {
                                salary = salary.toCurrency('R');
                            }

                            const calculateDeductiblesTotal = () => {
                                const list = (deductible && deductible.list || []);
                                const l = list.filter(({text, value}) => text && value).map(({value}) => value);
                                const total = l.reduce((n1, n2) => n1 + n2, 0);
                                return total.toCurrency('R');
                            };

                            const resInner = {};
                            resInner["Contract Type"] = contract_type;
                            resInner["Start Date"] = Dates.formatDate(start_date) || "";
                            resInner["Expiry Date"] = Dates.formatDate(expiry_date) || "";
                            resInner["End Of Trial Period"] = Dates.formatDate(end_of_trial_period) || "";
                            resInner["Start Time"] = start_time;
                            resInner["End Time"] = end_time;
                            resInner["Daily Working Hours"] = daily_working_hours;
                            resInner["Notes"] = notes;

                            resInner["Payment Type"] = payment_type;
                            if (payment_type === "Salary") {
                                resInner["Salary Interval"] = salary_interval;
                                resInner["Salary"] = salary;
                            }
                            if (payment_type === "Wage") {
                                resInner["Wage"] = wage;
                            }
                            resInner["Deductibles"] = salary_info.deductible && salary_info.deductible.list ? salary_info.deductible.list.map(v => {
                                return v.text + " = " + (isNumber(v.value) ? v.value.toCurrency('R') : 'N/A');
                            }).join(', ') : "N/A";
                            resInner["Deductibles Total"] = salary_info.deductible && salary_info.deductible.list ? calculateDeductiblesTotal() : "N/A";
                            resInner["Contract Document Attachment"] = doc && doc.dlUrls ? doc.dlUrls[0] : "N/A";
                            resInner["Job Profile Document Attachment"] = job_profile_doc && job_profile_doc.dlUrls ? job_profile_doc.dlUrls[0] : "N/A";
                            return {...res, ...resInner};
                        });
                    }
                })).reduce((a1, a2) => [...a1, ...a2], []);

                return await this.export_excel_impl(loggedUser, "Employee-Docs", "Employees-Active", "Contracts", cols, rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel_by_employee">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Contract Type', key: 'Contract Type', width: 20},
                    {header: 'Start Date', key: 'Start Date', width: 20},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'End Of Trial Period', key: 'End Of Trial Period', width: 20},
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
                        "Contract Type": contract_details && contract_details.contract_type ? contract_details.contract_type : "N/A",
                        "Start Date": contract_details && contract_details.start_date ? new Date(contract_details.start_date) : "N/A",
                        "Expiry Date": contract_details && contract_details.expiry_date ? new Date(contract_details.expiry_date) : "N/A",
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

                const name = lname + "-" + fname;
                const folder = "Contracts";
                return await this.export_excel_impl(
                        loggedUser,
                        "Employee-Docs/Employees-Active/" + folder.replace(" ", "-"),
                        name.replaceAll(" ", "-"),
                        name + "-" + folder,
                        cols,
                        rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="sub_collection_keys">
        sub_collection_keys(old_data, updateAttrs, sub_collection_keys = {}) {
            const {contract_details = {}, salary_info = {}} = old_data;
            const {start_date, expiry_date, end_of_trial_period, contract_type, daily_working_hours} = contract_details;
            const {payment_type, salary_interval, salary, wage} = salary_info;
            const keys = {};
            if (updateAttrs) {
                const {contract_details: _contract_details = {}, salary_info: _salary_info = {}} = updateAttrs;
                const {start_date: _start_date, expiry_date: _expiry_date, end_of_trial_period: _end_of_trial_period, contract_type: _contract_type, daily_working_hours: _daily_working_hours} = _contract_details;
                const {payment_type: _payment_type, salary_interval: _salary_interval, salary: _salary, wage: _wage} = _salary_info;

                keys.contract_details = sub_collection_keys.contract_details || {};
                keys.contract_details.contract_type = keys.contract_details.contract_type || {};
                if (contract_type && _contract_type && contract_type !== _contract_type) {
                    keys.contract_details.contract_type[contract_type] = false;
                }
                if (_contract_type) {
                    keys.contract_details.contract_type[_contract_type] = true;
                }
                if (Object.keys(keys.contract_details.contract_type).isEmpty()) {
                    delete keys.contract_details.contract_type;
                }
                if (Object.keys(keys.contract_details).isEmpty()) {
                    delete keys.contract_details;
                }

                keys.salary_info = sub_collection_keys.salary_info || {};
                keys.salary_info.payment_type = keys.salary_info.payment_type || {};
                if (payment_type && _payment_type && payment_type !== _payment_type) {
                    keys.salary_info.payment_type[payment_type] = false;
                }
                if (_payment_type) {
                    keys.salary_info.payment_type[_payment_type] = true;
                }
                if (Object.keys(keys.salary_info.payment_type).isEmpty()) {
                    delete keys.salary_info.payment_type;
                }
                keys.salary_info.salary_interval = keys.salary_info.salary_interval || {};
                if (salary_interval && _salary_interval && salary_interval !== _salary_interval) {
                    keys.salary_info.salary_interval[salary_interval] = false;
                }
                if (_salary_interval) {
                    keys.salary_info.salary_interval[_salary_interval] = true;
                }
                if (Object.keys(keys.salary_info.salary_interval).isEmpty()) {
                    delete keys.salary_info.salary_interval;
                }
                if (Object.keys(keys.salary_info).isEmpty()) {
                    delete keys.salary_info;
                }
            } else {
                keys.contract_details = {
                };
                if (contract_type) {
                    keys.contract_details.contract_type = {};
                    keys.contract_details.contract_type[contract_type] = true;
                }
                if (Object.keys(keys.contract_details).isEmpty()) {
                    delete keys.contract_details;
                }

                keys.salary_info = {
                };
                if (payment_type) {
                    keys.salary_info.payment_type = {};
                    keys.salary_info.payment_type[payment_type] = true;
                }
                if (salary_interval) {
                    keys.salary_info.salary_interval = {};
                    keys.salary_info.salary_interval[salary_interval] = true;
                }
                if (Object.keys(keys.salary_info).isEmpty()) {
                    delete keys.salary_info;
                }
            }

            return keys;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return this.filter_selectImpl(evt, filterData, q => {
                const {
                    contract_type, payment_type, salary_interval
                } = filterData;

                if (contract_type) {
                    q = q.where(`contract_details.contract_type`, '==', contract_type);
                }
                if (payment_type) {
                    q = q.where(`salary_info.payment_type`, '==', payment_type);
                }
                if (salary_interval) {
                    q = q.where(`salary_info.salary_interval`, '==', salary_interval);
                }
                return q;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData, q => {
                const {
                    contract_type, payment_type, salary_interval
                } = filterData;

                if (contract_type) {
                    q = q.where(`contract_details.contract_type`, '==', contract_type);
                }
                if (payment_type) {
                    q = q.where(`salary_info.payment_type`, '==', payment_type);
                }
                if (salary_interval) {
                    q = q.where(`salary_info.salary_interval`, '==', salary_interval);
                }
                return q;
            });
        }
        // </editor-fold>

    }

    new Controller(events, db);
})();