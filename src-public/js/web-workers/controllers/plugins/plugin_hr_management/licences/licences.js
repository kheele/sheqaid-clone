
(() => {
    class Controller extends AEmployeeDocsController {
        constructor(events) {
            super(
                    events,
                    {singular: "Employee License", plural: "Employees Licenses"},
                    "plugin_sheq_assist/employees/licenses/"
                    );

//            addAction("export_excel_by_employee", this.export_excel_by_employee.bind(this));

            this.collectionGroup = "license_list";
        }

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

                    {header: 'Date', key: 'Date', width: 20},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Notes', key: 'Notes', width: 35},
                    {header: 'Document Attachment', key: 'Document Attachment', width: 45}
                ];

//                console.log('employeeList', list)

                const rows = list.map(employee => {
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
                            employee_license_list = {},
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
//                        res["Licenses"] = employee_contracts_path;
                        let list = Object.keys(employee_license_list).map(id => {
                            return {id, expiry_date: employee_license_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_license_list[id]};
                        });

                        return list.map(item => {
                            const {data: {created_at, date, expiry_date, notes, doc}} = item;
                            
                            const resInner = {};
                            resInner["Date"] = Dates.formatDate(date) || "";
                            resInner["Expiry Date"] = Dates.formatDate(expiry_date) || "";
                            resInner["Notes"] = notes;
                            resInner["Document Attachment"] = doc && doc.dlUrls ? doc.dlUrls[0] : "N/A";
                            return {...res, ...resInner};
                        });
                    }
                }).reduce((a1, a2) => [...a1, ...a2], []);

                return await this.export_excel_impl(loggedUser, "Employee-Docs", "Employees-Active", "Licenses", cols, rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel_by_employee">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Date', key: 'Date', width: 20},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Notes', key: 'Notes', width: 35},
                    {header: 'Document Attachment', key: 'Document Attachment', width: 45}
                ];

                const {
                    fname, lname,
                    employee_license_list, sub_collection_keys: {
                        employee_license_list: {latest, id: ids}
                    }
                } = employee.data;

                let list = Object.keys(employee_license_list).map(id => {
                    return {id, expiry_date: employee_license_list[id].expiry_date || null};
                });
                list.sortBy('expiry_date', 'desc');
                list = list.map(({id, expiry_date}) => {
                    return {id, data: employee_license_list[id]};
                });

                console.log(evt, list)

                const rows = list.map(({id, data: {
                created_at, date, expiry_date, notes, doc
                }}) => {
                    console.log('test contracts export doc', doc)

                    const res = {
                        "Date": Dates.formatDate(date) || "N/A",
                        "Expiry Date": Dates.formatDate(expiry_date) || "N/A",
                        "Notes": notes || "N/A",
                        "Document Attachment": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
                    };
                    return res;
                });

                const name = lname + "-" + fname;
                const folder = "Licenses";
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
            const {} = old_data;
            const keys = {};
            if (updateAttrs) {

            } else {

            }
            return keys;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return this.filter_selectImpl(evt, filterData, q => {
                return q;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData);
        }
        // </editor-fold>

    }

    new Controller(events);
})();