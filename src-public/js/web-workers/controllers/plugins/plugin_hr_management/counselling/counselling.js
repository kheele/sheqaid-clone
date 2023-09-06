
(() => {
    class Controller extends AEmployeeDocsController {

        constructor(events) {
            super(
                    events,
                    {singular: "Employee Counseling", plural: "Employees Counselings"},
                    "plugin_sheq_assist/employees/counselling/"
                    );

            this.collectionGroup = "counselling_list";
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

                    {header: 'Responsible Person', key: 'Responsible Person', width: 25},
                    {header: 'Counselling Types', key: 'Counselling Types', width: 25},
                    {header: 'Reasons For Counseling', key: 'Reasons For Counseling', width: 25},
                    {header: 'Description Of Incident', key: 'Description Of Incident', width: 35},
                    {header: "Corrective Actions", key: "Corrective Actions", width: 35},
                    {header: "Counselling Hours To Complete", key: "Counselling Hours To Complete", width: 35},
                    {header: 'Completion Date', key: 'Completion Date', width: 20},
                    {header: 'Witness List', key: 'Witness List', width: 35},
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
                            employee_competency_list = {},
                            employee_contract_list = {},
                            employee_counselling_list = {},
                            employee_leave_list = {},
                            employee_medical_list = {},
                            employee_warning_list = {},
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
//                        res["Counseling"] = employee_leaves_path;

                        let list = Object.keys(employee_counselling_list).map(id => {
                            return {id, expiry_date: employee_counselling_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_counselling_list[id]};
                        });

                        return list.map(item => {
                            const {
                                data: {
                                    created_at,
                                    //1
                                    employee,
                                    responsible_person,
                                    //2
                                    types,
                                    reasons,
                                    incident_desc,
                                    corrective_actions,
                                    counselling_hrs_to_complete,
                                    expiry_date,
                                    witness_list,
                                    //3
                                    doc
                                }
                            } = item;

                            const person_mapper = (v) => {
                                if (!v)
                                    return 'N/A';
                                const {id, lname, fname, data} = v;
                                return (lname || data.lname) + ' ' + (fname || data.fname);
                            };

                            const resInner = {};
                            resInner["Responsible Person"] = person_mapper(responsible_person);
                            resInner["Counselling Types"] = types ? types.map(v => v).join(', ') : 'N/A';
                            resInner["Reasons For Counseling"] = reasons ? reasons.map(v => v).join(', ') : 'N/A';
                            resInner["Description Of Incident"] = incident_desc || 'N/A';
                            resInner["Corrective Actions"] = corrective_actions || "N/A";
                            resInner["Counselling Hours To Complete"] = counselling_hrs_to_complete || "N/A";
                            resInner["Completion Date"] = expiry_date ? new Date(expiry_date) : "N/A";
                            resInner["Witness List"] = witness_list ? witness_list.map(person_mapper).join(', ') : "N/A";
                            resInner["Document"] = doc && doc.dlUrls ? doc.dlUrls[0] : "N/A";
                            return {...res, ...resInner};
                        });
                    }
                }).reduce((a1, a2) => [...a1, ...a2], []);

                return await this.export_excel_impl(loggedUser, "Employee-Docs", "Employees-Active", "Counseling", cols, rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel_by_employee">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Responsible Person', key: 'Responsible Person', width: 25},
                    {header: 'Counselling Types', key: 'Counselling Types', width: 25},
                    {header: 'Reasons For Counseling', key: 'Reasons For Counseling', width: 25},
                    {header: 'Description Of Incident', key: 'Description Of Incident', width: 35},
                    {header: "Corrective Actions", key: "Corrective Actions", width: 35},
                    {header: "Counselling Hours To Complete", key: "Counselling Hours To Complete", width: 35},
                    {header: 'Completion Date', key: 'Completion Date', width: 20},
                    {header: 'Witness List', key: 'Witness List', width: 35},
                    {header: 'Document', key: 'Document', width: 35}
                ];

                const {
                    fname, lname,
                    employee_counselling_list, sub_collection_keys: {
                        employee_counselling_list: {latest, id: ids}
                    }
                } = employee.data;

                let list = Object.keys(employee_counselling_list).map(id => {
                    return {id, expiry_date: employee_counselling_list[id].expiry_date || null};
                });
                list.sortBy('expiry_date', 'desc');
                list = list.map(({id, expiry_date}) => {
                    return {id, data: employee_counselling_list[id]};
                });

                console.log(evt, list)

                const rows = list.map(({
                id,
                        data: {
                        created_at,
                                //1
                                employee,
                                responsible_person,
                                //2
                                types,
                                reasons,
                                incident_desc,
                                corrective_actions,
                                counselling_hrs_to_complete,
                                expiry_date,
                                witness_list,
                                //3
                                doc
                        }
                }) => {
                    console.log('test leaves export doc', doc)

                    const person_mapper = (v) => {
                        if (!v)
                            return 'N/A';
                        const {id, lname, fname, data} = v;
                        return (lname || data.lname) + ' ' + (fname || data.fname);
                    };

                    const res = {
                        "Responsible Person": person_mapper(responsible_person),
                        "Counselling Types": types ? types.map(v => v).join(', ') : 'N/A',
                        "Reasons For Counseling": reasons ? reasons.map(v => v).join(', ') : 'N/A',
                        "Description Of Incident": incident_desc || 'N/A',
                        "Corrective Actions": corrective_actions || "N/A",
                        "Counselling Hours To Complete": counselling_hrs_to_complete || "N/A",
                        "Completion Date": expiry_date ? new Date(expiry_date) : "N/A",
                        "Witness List": witness_list ? witness_list.map(person_mapper).join(', ') : "N/A",
                        "Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
                    };
                    return res;
                });

                const name = lname + "-" + fname;
                const folder = "Counseling";
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
            const {responsible_person, types, reasons} = old_data;
            const keys = {};
            if (updateAttrs) {
                const {responsible_person: _responsible_person, types: _types, reasons: _reasons} = updateAttrs;

                keys.responsible_person = sub_collection_keys.responsible_person || {};
                if (responsible_person && _responsible_person && responsible_person.id !== _responsible_person.id) {
                    keys.responsible_person[responsible_person.id] = false;
                }
                if (_responsible_person) {
                    keys.responsible_person[_responsible_person.id] = true;
                }
                if (Object.keys(keys.responsible_person).isEmpty()) {
                    delete keys.responsible_person;
                }

                keys.types = sub_collection_keys.types || {};
                if (types && _types && types !== _types) {
                    types.forEach(key => {
                        keys.reasons[key] = false;
                    });
                }
                if (_types) {
                    _types.forEach(key => {
                        keys.types[key] = true;
                    });
                }
                if (Object.keys(keys.types).isEmpty()) {
                    delete keys.types;
                }

                keys.reasons = sub_collection_keys.reasons || {};
                if (reasons && _reasons && reasons !== _reasons) {
                    reasons.forEach(key => {
                        keys.reasons[key] = false;
                    });
                }
                if (_reasons) {
                    _reasons.forEach(key => {
                        keys.reasons[key] = true;
                    });
                }
                if (Object.keys(keys.reasons).isEmpty()) {
                    delete keys.reasons;
                }
            } else {
                if (responsible_person) {
                    keys.responsible_person = {
                    };
                    keys.responsible_person[responsible_person.id] = true;
                }
                if (types) {
                    keys.types = {
                    };
                    types.forEach(key => {
                        keys.types[key] = true;
                    });
                }
                if (reasons) {
                    keys.reasons = {
                    };
                    reasons.forEach(key => {
                        keys.reasons[key] = true;
                    });
                }
            }
            return keys;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return this.filter_selectImpl(evt, filterData, q => {
                const {
                    responsible_person,
                    types,
                    reasons
                } = filterData;
                
                if (responsible_person) {
                    q = q.where(`responsible_person.id`, '==', responsible_person);
                }
                if (types) {
                    q = q.where(`types`, 'in', types);
                }
                if (reasons) {
                    q = q.where(`reasons`, 'in', reasons);
                }
                return q;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData, q => {
                const {
                    responsible_person,
                    types,
                    reasons
                } = filterData;
                
                if (responsible_person) {
                    q = q.where(`responsible_person.id`, '==', responsible_person);
                }
                if (types) {
                    q = q.where(`types`, 'in', types);
                }
                if (reasons) {
                    q = q.where(`reasons`, 'in', reasons);
                }
                return q;
            });
        }
        // </editor-fold>

    }

    new Controller(events);
})();