
(() => {
    class Controller extends AEmployeeDocsController {
        //date, expiry_date, type, notes, employee, department
        constructor(events, db) {
            super(
                    events,
                    db,
                    {singular: "Employee Leave", plural: "Employees Leaves"},
                    "plugin_sheq_assist/employees/leaves/"
                    );

            this.collectionGroup = "leave_list";
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

                    {header: 'Leave Due To', key: 'Leave Due To', width: 25},
                    {header: 'Leave Type', key: 'Leave Type', width: 25},
                    {header: 'Start Date', key: 'Leave Start Date', width: 25},
                    {header: 'Expiry Date', key: 'Leave Expiry Date', width: 20},
                    {header: 'No. Of Days Booked', key: 'No. Of Days Booked', width: 35},
                    {header: "Reason Of Leave", key: "Reason Of Leave", width: 35},
                    {header: "Employee's Comments", key: "Employee's Comments", width: 35},
                    {header: 'Notes', key: 'Notes', width: 35},
                    {header: 'Proof Of Sick Note', key: 'Proof Of Sick Note', width: 35}
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
//                        const employee_leaves_path = await Events.get('plugin_sheq_assist/employees/leaves/').then(tbl => {
//                            return tbl.export_excel_by_employee.call(tbl, null, employee);
//                        });
//                        res["Leaves"] = employee_leaves_path;

                        let list = Object.keys(employee_leave_list).map(id => {
                            return {id, expiry_date: employee_leave_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_leave_list[id]};
                        });

                        return list.map(item => {
                            const {data: {doc, employee, type, due_to, date, expiry_date, days_booked, reason, employee_comments, notes}} = item;
                            
                            const resInner = {};
                            resInner["Leave Due To"] = due_to || "";
                            resInner["Leave Type"] = type;
                            resInner["Start Date"] = Dates.formatDate(date) || "";
                            resInner["Expiry Date"] = Dates.formatDate(expiry_date) || "";
                            resInner["No. Of Days Booked"] = days_booked;
                            resInner["Reason Of Leave"] = reason;
                            resInner["Employee's Comments"] = employee_comments;
                            resInner["Notes"] = notes;
                            resInner["Proof Of Sick Note"] = doc && doc.dlUrls ? doc.dlUrls[0] : "N/A";
                            return {...res, ...resInner};
                        });
                    }
                }).reduce((a1, a2) => [...a1, ...a2], []);

                return await this.export_excel_impl(loggedUser, "Employee-Docs", "Employees-Active", "Leaves", cols, rows);
            });
        }
        // </editor-fold>
        
        // <editor-fold defaultstate="collapsed" desc="export_excel_by_employee">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Leave Due To', key: 'Leave Due To', width: 25},
                    {header: 'Leave Type', key: 'Leave Type', width: 25},
                    {header: 'Leave Start Date', key: 'Leave Start Date', width: 25},
                    {header: 'Leave Expiry Date', key: 'Leave Expiry Date', width: 20},
                    {header: 'No. Of Days Booked', key: 'No. Of Days Booked', width: 35},
                    {header: "Reason Of Leave", key: "Reason Of Leave", width: 35},
                    {header: "Employee's Comments", key: "Employee's Comments", width: 35},
                    {header: 'Notes', key: 'Notes', width: 35},
                    {header: 'Proof Of Sick Note', key: 'Proof Of Sick Note', width: 35}
                ];
                
                const {
                    fname, lname,
                    employee_leave_list, sub_collection_keys: {
                            employee_leave_list: {latest, id: ids}
                        }
                }  = employee.data;
                
                let list = Object.keys(employee_leave_list).map(id => {
                    return {id, expiry_date: employee_leave_list[id].expiry_date || null};
                });
                list.sortBy('expiry_date', 'desc');
                list = list.map(({id, expiry_date}) => {
                    return {id, data: employee_leave_list[id]};
                });

                console.log(evt, list)
                
                const rows = list.map(({id, data: {
                    created_at, doc, employee, type, due_to, date, expiry_date, days_booked, reason, employee_comments, notes    
                }}) => {
                    console.log('test leaves export doc', doc)
                    const res = {
                        "Leave Due To": due_to || 'N/A',
                        "Leave Type": type,
                        "Leave Start Date": date ? new Date(date) : "N/A",
                        "Leave Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
                        "No. Of Days Booked": days_booked || 0,
                        "Reason Of Leave": reason || "N/A",
                        "Employee's Comments": employee_comments || "N/A",
                        "Notes": notes || "N/A",
                        "Proof Of Sick Note": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
                    };
                    return res;
                });

                const name = lname + "-" + fname;
                const folder = "Leaves";
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
            const {type, due_to, date} = old_data;
            const keys = {};
            if (updateAttrs) {
                const {type: _type, due_to: _due_to, date: _date} = updateAttrs;

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
                
                keys.due_to = sub_collection_keys.due_to || {};
                if (due_to && _due_to && due_to !== _due_to) {
                    keys.due_to[due_to] = false;
                }
                if (_due_to) {
                    keys.due_to[_due_to] = true;
                }
                if (Object.keys(keys.due_to).isEmpty()) {
                    delete keys.due_to;
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
                if (type) {
                    keys.type = {[type]: true};
                }
                if (due_to) {
                    keys.due_to = {[due_to]: true};
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
                    type,
                    due_to,
                    date
                } = filterData;
                
                if (type) {
                    q = q.where(`type`, '==', type);
                }
                if (due_to) {
                    q = q.where(`due_to`, '==', due_to);
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
                const {
                    type,
                    due_to,
                    date
                } = filterData;
                
                if (type) {
                    q = q.where(`type`, '==', type);
                }
                if (due_to) {
                    q = q.where(`due_to`, '==', due_to);
                }
                if (date) {
                    q = q.where(`date`, '==', date);
                }                
                return q;
            });
        }
        // </editor-fold>

    }

    new Controller(events, db);
})();