
(() => {
    class Controller extends AEmployeeDocsController {
        //date, expiry_date, type, notes, employee, department
        constructor(events) {
            super(
                    events,
                    {singular: "Employee Warning", plural: "Employees Warnings"},
                    "plugin_sheq_assist/employees/warnings/"
                    );

            this.collectionGroup = "warning_list";
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

                    {header: 'Issued By', key: 'Issued By', width: 25},
                    {header: 'Warning Type', key: 'Warning Type', width: 25},
                    {header: 'Warning Date', key: 'Warning Date', width: 25},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Details Of Misconduct', key: 'Details Of Misconduct', width: 35},
                    {header: "Employee's Comments", key: "Employee's Comments", width: 35},
                    {header: 'Notes', key: 'Notes', width: 35},
                    {header: 'Document', key: 'Document', width: 35}
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
//                        const employee_warnings_path = await Events.get('plugin_sheq_assist/employees/warnings/').then(tbl => {
//                            return tbl.export_excel_by_employee.call(tbl, null, employee);
//                        });
//                        res["Warnings"] = employee_warnings_path;

                        let list = Object.keys(employee_warning_list).map(id => {
                            return {id, expiry_date: employee_warning_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_warning_list[id]};
                        });

                        return list.map(item => {
                            const {data: {issued_by, type, date, expiry_date, details, employee_comments, notes, doc}} = item;
                            
                            const resInner = {};
                            resInner["Issued By"] = issued_by ? (issued_by.lname + ' ' + issued_by.fname) : "";
                            resInner["Warning Type"] = type;
                            resInner["Warning Date"] = Dates.formatDate(date) || "";
                            resInner["Expiry Date"] = Dates.formatDate(expiry_date) || "";
                            resInner["Details Of Misconduct"] = details;
                            resInner["Employee's Comments"] = employee_comments;
                            resInner["Notes"] = notes;
                            resInner["Document"] = doc && doc.dlUrls ? doc.dlUrls[0] : "N/A";
                            return {...res, ...resInner};
                        });
                    }
                }).reduce((a1, a2) => [...a1, ...a2], []);

                return await this.export_excel_impl(loggedUser, "Employee-Docs", "Employees-Active", "Warnings", cols, rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel_by_employee">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Issued By', key: 'Issued By', width: 25},
                    {header: 'Warning Type', key: 'Warning Type', width: 25},
                    {header: 'Warning Date', key: 'Warning Date', width: 25},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Details Of Misconduct', key: 'Details Of Misconduct', width: 35},
                    {header: "Employee's Comments", key: "Employee's Comments", width: 35},
                    {header: 'Notes', key: 'Notes', width: 35},
                    {header: 'Document', key: 'Document', width: 35}
                ];

                const {
                    fname, lname,
                    employee_warning_list, sub_collection_keys: {
                        employee_warning_list: {latest, id: ids}
                    }
                } = employee.data;

                let list = Object.keys(employee_warning_list).map(id => {
                    return {id, expiry_date: employee_warning_list[id].expiry_date || null};
                });
                list.sortBy('expiry_date', 'desc');
                list = list.map(({id, expiry_date}) => {
                    return {id, data: employee_warning_list[id]};
                });

                console.log(evt, list)

                const rows = list.map(({id, data: {
                created_at, issued_by, type, date, expiry_date, details, employee_comments, notes, doc
                }}) => {
                    console.log('test wargings export doc', doc)
                    const res = {
                        "Issued By": issued_by ? (issued_by.lname + ' ' + issued_by.fname) : 'N/A',
                        "Warning Type": type,
                        "Warning Date": date ? new Date(date) : "N/A",
                        "Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
                        "Details Of Misconduct": details || "N/A",
                        "Employee's Comments": employee_comments || "N/A",
                        "Notes": notes || "N/A",
                        "Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
                    };
                    return res;
                });

                const name = lname + "-" + fname;
                const folder = "Warnings";
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
            const {issued_by, type, date} = old_data;
            const keys = {};
            if (updateAttrs) {
                const {type: _type, issued_by: _issued_by, date: _date} = updateAttrs;

                keys.issued_by = sub_collection_keys.issued_by || {};
                if (issued_by && _issued_by && issued_by.id !== _issued_by.id) {
                    keys.issued_by[issued_by.id] = false;
                }
                if (_issued_by) {
                    keys.issued_by[_issued_by.id] = true;
                }
                if (Object.keys(keys.issued_by).isEmpty()) {
                    delete keys.issued_by;
                }
                
                keys.type = sub_collection_keys.type || {};
                if (type && _type && type !== _type) {
                    keys.type[type] = false;
                }
                if (_type) {
                    keys.type[_type] = true;
                }
                if (Object.keys(keys.type).isEmpty()) {
                    delete keys.type;
                }

                keys.date = sub_collection_keys.date || {};
                if (date && _date && date !== _date) {
                    keys.date[date] = false;
                }
                if (_date) {
                    keys.date[_date] = true;
                }
                if (Object.keys(keys.date).isEmpty()) {
                    delete keys.date;
                }
            } else {
                if (issued_by) {
                    keys.issued_by = {[issued_by.id]: true};
                }
                if (type) {
                    keys.type = {[type]: true};
                }
                if (date) {
                    keys.date = {[date]: true};
                }
            }
            return keys;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return this.filter_selectImpl(evt, filterData, q => {
                const {
                    issued_by, type,
                    date
                } = filterData;
                
                if (issued_by) {
                    q = q.where(`issued_by.id`, '==', issued_by);
                }
                if (type) {
                    q = q.where(`type`, '==', type);
                }
                if (date) {
                    q = q.where(`date`, '==', date);
                }
                return q;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData, q => {
                const {issued_by, type, date} = filterData;
                
                const col = 'sub_collection_keys.' + this.collectionGroup;
                
                if (issued_by) {
                    q = q.where(`issued_by.id`, '==', issued_by);
                }
                if (type) {
                    q = q.where(`type`, '==', type);
                }
                if (date) {
                    q = q.where(`date`, '==', date);
                }
                return q;
            });
        }
        // </editor-fold>

    }

    new Controller(events);
})();