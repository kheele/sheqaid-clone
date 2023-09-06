
(() => {
    class Controller extends AEmployeeDocsController {
        constructor(events) {
            super(
                    events,
                    {singular: "Employee Competency", plural: "Employees Competencies"},
                    "plugin_sheq_assist/employees/competencies/"
                    );

            this.collectionGroup = "competency_list";
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
                    {header: 'ID/Passport No.', key: 'ID/Passport No.', width: 25},
                    {header: 'Gender', key: 'Gender', width: 15},
                    {header: 'Phone No.', key: 'Phone No.', width: 15},
                    {header: 'Email Address', key: 'Email Address', width: 25},

                    {header: 'Certificate Type', key: 'Certificate Type', width: 25},
                    {header: 'Competency Type', key: 'Competency Type', width: 25},
                    {header: 'Accreditation Number', key: 'Accreditation Number', width: 25},
                    {header: 'Training Type', key: 'Training Type', width: 25},
                    {header: 'Course / Module', key: 'Course / Module', width: 25},
                    {header: 'Date Of Issue', key: 'Date Of Issue', width: 25},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
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
                        "ID/Passport No.": id_num || passport_num || '',
                        Gender: sex || sex,
                        "Phone No.": phone ? String(phone) : "",
                        "Email Address": email || ""
                    };

                    {
                        let list = Object.keys(employee_competency_list).map(id => {
                            return {id, expiry_date: employee_competency_list[id].expiry_date || null};
                        });
                        list.sortBy('expiry_date', 'desc');
                        list = list.map(({id, expiry_date}) => {
                            return {id, data: employee_competency_list[id]};
                        });

                        return list.map(item => {
                            const {data: {type, competency_type, accreditation_num, issued_date, expiry_date, training, doc}} = item;

                            const resInner = {};
                            resInner["Certificate Type"] = type || "N/A";
                            resInner["Competency Type"] = competency_type || "N/A";
                            resInner["Accreditation Number"] = accreditation_num || "N/A";
                            if (training) {
                                const {type: training_type, course_or_module, job_title} = training;
                                resInner["Training Type"] = training_type || "N/A";
                                resInner["Course / Module"] = course_or_module ? (isString(course_or_module) ? course_or_module : (course_or_module.name || course_or_module.data.name)) : "N/A";
                            }
                            resInner["Date Of Issue"] = Dates.formatDate(issued_date) || "N/A";
                            resInner["Expiry Date"] = Dates.formatDate(expiry_date) || "N/A";
                            resInner["Document"] = doc && doc.dlUrls ? doc.dlUrls[0] : "N/A";
                            return {...res, ...resInner};
                        });
                    }
                }).reduce((a1, a2) => [...a1, ...a2], []);

                return await this.export_excel_impl(loggedUser, "Employee-Docs", "Employees-Active", "Competency-Certificates", cols, rows);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel_by_employee">
        async export_excel_by_employee(evt, employee) {
            return Events.whenLoggedIn(async loggedUser => {
                const cols = [
                    {header: 'Certificate Type', key: 'Certificate Type', width: 25},
                    {header: 'Competency Type', key: 'Competency Type', width: 25},
                    {header: 'Accreditation Number', key: 'Accreditation Number', width: 25},
                    {header: 'Training Type', key: 'Training Type', width: 25},
                    {header: 'Course / Module', key: 'Course / Module', width: 25},
                    {header: 'Date Of Issue', key: 'Date Of Issue', width: 25},
                    {header: 'Expiry Date', key: 'Expiry Date', width: 20},
                    {header: 'Document', key: 'Document', width: 35}
                ];

                const {
                    fname, lname,
                    employee_competency_list, sub_collection_keys: {
                        employee_competency_list: {latest, id: ids}
                    }
                } = employee.data;

                let list = Object.keys(employee_competency_list).map(id => {
                    return {id, expiry_date: employee_competency_list[id].expiry_date || null};
                });
                list.sortBy('expiry_date', 'desc');
                list = list.map(({id, expiry_date}) => {
                    return {id, data: employee_competency_list[id]};
                });

                console.log(evt, list)

                const rows = list.map(({id, data: {
                created_at, type, competency_type, accreditation_num, issued_date, expiry_date, training, doc
                }}) => {
                    console.log('test competencies export doc', doc)
                    const res = {
                        "Certificate Type": type || "N/A",
                        "Competency Type": competency_type || "N/A",
                        "Accreditation Number": accreditation_num || "N/A",
                        "Date Of Issue": Dates.formatDate(issued_date) || "N/A",
                        "Expiry Date": expiry_date ? new Date(expiry_date) : "N/A",
                        "Document": doc && doc.dlUrls ? doc.dlUrls[0] : "N/A"
                    };
                    if (training) {
                        const {type: training_type, course_or_module, job_title} = training;
                        res["Training Type"] = training_type || "N/A";
                        res["Course / Module"] = course_or_module ? (isString(course_or_module) ? course_or_module : (course_or_module.name || course_or_module.data.name)) : "N/A";
                    }
                    return res;
                });

                const name = lname + "-" + fname;
                const folder = "Competency-Certificates";
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
            const {type, competency_type, training, trainer, issued_date} = old_data;
            const keys = {};
            if (updateAttrs) {
                const {type: _type, competency_type: _competency_type, training: _training, trainer: _trainer, issued_date: _issued_date} = updateAttrs;

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

                keys.competency_type = sub_collection_keys.competency_type || {};
                if (competency_type && _competency_type && competency_type !== _competency_type) {
                    keys.competency_type[competency_type] = false;
                }
                if (_competency_type) {
                    keys.competency_type[_competency_type] = true;
                }
                if (Object.keys(keys.competency_type).isEmpty()) {
                    delete keys.competency_type;
                }

                keys.training = sub_collection_keys.training || {};
                keys.training.type = keys.training.type || {};
                if (training && _training && (training.type && _training.type && training.type !== _training.type)) {
                    keys.training.type[training.type] = false;
                }
                keys.training.course_or_module = keys.training.course_or_module || {};
                if (training && _training && (training.course_or_module && _training.course_or_module && training.course_or_module.id !== _training.course_or_module.id)) {
                    keys.training.course_or_module[training.course_or_module.id] = false;
                }
                keys.training.job_title = keys.training.job_title || {};
                if (training && _training && (training.job_title && _training.job_title && training.job_title.id !== _training.job_title.id)) {
                    keys.training.job_title[training.job_title.id] = false;
                }
                if (_training) {
                    if (_training.type) {
                        keys.training.type[_training.type] = true;
                    }
                    if (_training.course_or_module) {
                        keys.training.course_or_module[_training.course_or_module.id] = true;
                    }
                    if (_training.job_title) {
                        keys.training.job_title[_training.job_title.id] = true;
                    }
                }
                if (Object.keys(keys.training.type).isEmpty()) {
                    delete keys.training.type;
                }
                if (Object.keys(keys.training.course_or_module).isEmpty()) {
                    delete keys.training.course_or_module;
                }
                if (Object.keys(keys.training.job_title).isEmpty()) {
                    delete keys.training.job_title;
                }
                if (Object.keys(keys.training).isEmpty()) {
                    delete keys.training;
                }

                keys.trainer = sub_collection_keys.trainer || {};
                keys.trainer.id = keys.trainer.id || {};
                keys.trainer.name = keys.trainer.name || {};
                if (trainer) {
                    if (trainer.id && _trainer.id && trainer.id !== _trainer.id) {
                        keys.trainer.id[trainer.id] = false;
                    } else if (trainer.lname && _trainer.lname && (trainer.lname !== _trainer.lname && trainer.fname !== _trainer.fname)) {
                        keys.trainer.name[trainer.lname + trainer.fname] = false;
                    }
                }
                if (_trainer) {
                    if (_trainer.id) {
                        keys.trainer.id[_trainer.id] = true;
                    } else {
                        keys.trainer.name[_trainer.lname + _trainer.fname] = true;
                    }
                }
                if (Object.keys(keys.trainer.id).isEmpty()) {
                    delete keys.trainer.id;
                }
                if (Object.keys(keys.trainer.name).isEmpty()) {
                    delete keys.trainer.name;
                }
                if (Object.keys(keys.trainer).isEmpty()) {
                    delete keys.trainer;
                }

                keys.issued_date = sub_collection_keys.issued_date || {};
                if (issued_date && _issued_date && issued_date !== _issued_date) {
                    keys.issued_date[issued_date] = false;
                }
                if (_issued_date) {
                    keys.issued_date[_issued_date] = true;
                }
                if (Object.keys(keys.issued_date).isEmpty()) {
                    delete keys.issued_date;
                }
            } else {
                if (type) {
                    keys.type = {
                    };
                    keys.type[type] = true;
                }
                if (competency_type) {
                    keys.competency_type = {
                    };
                    keys.competency_type[competency_type] = true;
                }
                if (training) {
                    keys.training = {
                    };
                    if (training.type) {
                        keys.training.type = {};
                        keys.training.type[training.type] = true;
                    }
                    if (training.course_or_module) {
                        keys.training.course_or_module = {};
                        keys.training.course_or_module[training.course_or_module.id] = true;
                    }
                    if (training.job_title) {
                        keys.training.job_title = {};
                        keys.training.job_title[training.job_title.id] = true;
                    }
                }
                if (trainer) {
                    keys.trainer = {
                    };
                    if (trainer.id) {
                        keys.trainer.id = {};
                        keys.trainer.id[trainer.id] = true;
                    } else {
                        keys.trainer.name = {};
                        keys.trainer.name[trainer.lname + trainer.fname] = true;
                    }
                }
                if (issued_date) {
                    keys.issued_date = {
                        [issued_date]: true
                    };
                }
            }
//            return competency_type ? {competency_type: FBSettings.FieldValue.arrayUnion(competency_type)} : null;
            return keys;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_select">
        async filter_select(evt, filterData) {
            return this.filter_selectImpl(evt, filterData, q => {
                const {
                    type, competency_type, course_or_module, job_title,
                    issued_date
                } = filterData;

                if (type) {
                    q = q.where(`type`, '==', type);
                }
                if (competency_type) {
                    q = q.where(`competency_type`, '==', competency_type);
                }
                if (course_or_module) {
                    q = q.where(`training.course_or_module.id`, '==', course_or_module);
                }
                if (job_title) {
                    q = q.where(`training.job_title.id`, '==', job_title);
                }
                if (issued_date) {
                    q = q.where(`issued_date`, '==', issued_date);
                }

                return q;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return this.filterImpl(evt, filterData, extraFilterData, q => {
                const {
                    type, competency_type, course_or_module, job_title,
                    issued_date
                } = filterData;

                if (type) {
                    q = q.where(`type`, '==', type);
                }
                if (competency_type) {
                    q = q.where(`competency_type`, '==', competency_type);
                }
                if (course_or_module) {
                    q = q.where(`training.course_or_module.id`, '==', course_or_module);
                }
                if (job_title) {
                    q = q.where(`training.job_title.id`, '==', job_title);
                }
                if (issued_date) {
                    q = q.where(`issued_date`, '==', issued_date);
                }

                return q;
            });
        }
        // </editor-fold>

    }

    new Controller(events);
})();