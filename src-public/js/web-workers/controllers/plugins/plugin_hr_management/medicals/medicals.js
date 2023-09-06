
(() => {
    class Controller extends AEmployeeDocsController {
        constructor(events) {
            super(
                    events,
                    {singular: "Employee Medical", plural: "Employees Medicals"},
                    "plugin_sheq_assist/employees/medicals/"
                    );

            this.collectionGroup = "medical_list";
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

                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Annexture 3?', key: 'Annexture 3?', width: 25},
                    {header: 'Restrictions', key: 'Restrictions', width: 25},
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
//                        const employee_medicals_path = await Events.get('plugin_sheq_assist/employees/medicals/').then(tbl => {
//                            return tbl.export_excel_by_employee.call(tbl, null, employee);
//                        });
//                        res["Medicals Fitness Certificates"] = employee_medicals_path;

                        let list = Object.keys(employee_medical_list).map(id => {
                            return {id, expiry_date: employee_medical_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_medical_list[id]};
                        });

                        return list.map(item => {
                            const {data: {annexture_3, restrictions, expiry_date, doc}} = item;
                            
                            const resInner = {};
                            resInner["Expiry Date"] = Dates.formatDate(expiry_date) || "";
                            resInner["Annexture 3?"] = annexture_3;
                            resInner["Restrictions"] = restrictions;
                            resInner["Document"] = doc && doc.dlUrls ? doc.dlUrls[0] : "N/A";
                            return {...res, ...resInner};
                        });
                    }
                }).reduce((a1, a2) => [...a1, ...a2], []);

                return await this.export_excel_impl(loggedUser, "Employee-Docs", "Employees-Active", "Medical-Fitness", cols, rows);
            });
        }
        // </editor-fold>
        
        // <editor-fold defaultstate="collapsed" desc="export_excel_by_employee">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Annexture 3?', key: 'Annexture 3?', width: 25},
                    {header: 'Restrictions', key: 'Restrictions', width: 25},
                    {header: 'Document', key: 'Document', width: 35}
                ];
                
                const {
                    fname, lname, 

                    employee_medical_list, sub_collection_keys: {
                        employee_medical_list: {latest, id: ids}
                    }
                }  = employee.data;
                
                let list = Object.keys(employee_medical_list).map(id => {
                    return {id, expiry_date: employee_medical_list[id].expiry_date || null};
                });
                list.sortBy('expiry_date', 'desc');
                list = list.map(({id, expiry_date}) => {
                    return {id, data: employee_medical_list[id]};
                });

                console.log(evt, list)
                
                const rows = list.map(({id, data: {
                    created_at, annexture_3, restrictions, expiry_date, doc  
                }}) => {
                    console.log('test medicals export doc', doc)
                    const res = {
                        "Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
                        "Annexture 3?": annexture_3 || "N/A",
                        "Restrictions": restrictions || "N/A",
                        "Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
                    };
                    return res;
                });

                const name = lname + "-" + fname;
                const folder = "Medical-Fitness";
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
            const {annexture_3} = old_data;
            const keys = {};
            if (updateAttrs) {
                const {annexture_3: _annexture_3} = updateAttrs;
                
                keys.annexture_3 = sub_collection_keys.annexture_3 || {};
                if (annexture_3 && _annexture_3 && annexture_3 !== _annexture_3) {
                    keys.annexture_3[annexture_3] = false;
                }
                if (_annexture_3) {
                    keys.annexture_3[_annexture_3] = true;
                }
                if (Object.keys(keys.annexture_3).isEmpty()) {
                    delete keys.annexture_3;
                }
            } else {
                if (annexture_3) {
                    keys.annexture_3 = {[annexture_3]: true};
                }
            }
            return keys;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return this.filter_selectImpl(evt, filterData, q => {
                const {
                    annexture_3
                } = filterData;
                
                if (annexture_3) {
                    q = q.where(`annexture_3`, '==', annexture_3);
                }
                return q;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData, q => {
                const {annexture_3} = filterData;
                
                if (annexture_3) {
                    q = q.where(`annexture_3`, '==', annexture_3);
                }
                return q;
            });
        }
        // </editor-fold>

    }

    new Controller(events);
})();