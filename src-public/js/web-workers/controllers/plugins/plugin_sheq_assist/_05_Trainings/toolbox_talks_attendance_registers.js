(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {
                singular: "Toolbox Talk Attendance Register",
                plural: "Toolbox Talk Attendance Registers"
            }, "plugin_sheq_assist/05_Trainings/toolbox-talks/attendance-registers/", "plugin_sheq_assist_05_Training_toolbox_talks_attendance_registers");

            const {addAction} = this;

            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/filter", this.filter.bind(this));

            this.setQueryWhere(company_id => {
                return [['company_id', '==', company_id]];
            });
        }

        // </editor-fold>

        getDB() {
            return db;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {client, project, site, course_or_module, date, employee_list, attendance_register_list} = data;

                data.keywords = this.generateKeywords([course_or_module]);
                const item = await AControllerAid.prototype.create.call(this, evt, data);
                if (item) {
                    const path = await this.export_excel(evt, item);
                    return {path, item};
                }
                return item;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const {
                    client,
                    project,
                    site,
                    course_or_module,
                    date,
                    employee_list,
                    attendance_register_list
                } = updateAttrs;

                if (course_or_module) {
                    updateAttrs.keywords = this.generateKeywords([course_or_module]);
                }
                const updateItem = await AControllerAid.prototype.update.call(this, evt, id, updateAttrs);
                if (updateItem) {
                    const item = {id, data: updateItem};
                    const path = await this.export_excel(evt, item);
                    return {path, item};
                }
                return updateItem;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, ids) {
            if (!isArray(ids)) {
                ids = [ids];
            }
            const res = await Promise.all(ids.map(async id => {
                return await AControllerAid.prototype.remove.call(this, evt, id);
            }));
            return res;
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="export_excel">
        async export_excel(evt, item) {
            return Events.whenLoggedIn(async loggedUser => {
                if (item) {
                    if (item.data.employee_list) {
                        await Events.get('plugin_sheq_assist/employees/').then(employees_ctrl => {
                            return Promise.all(item.data.employee_list.filter(v => !!v).map(async v => {
                                return await employees_ctrl.find_by_id.call(employees_ctrl, null, v.id);
                            }));
                        }).then(val => {
                            val.sortBy('data.lname');
                            item.data.employee_list = val;
                        });
                    }

                    let {
                        id,
                        data: {
                            client, project, site,
                            course_or_module, date,
                            employee_list,
                        }
                    } = item;

                    const rows = employee_list.map((
                        {
                            id,
                            data: {
                                created_at,
                                profile_pic,
                                fname, lname, id_num, passport_num, dob, sex,
                                client, project, site, phone, email,
                                //
                                optional_info,
                            }
                        },
                        idx
                    ) => {
                        const res = {
                            idx: idx + 1,

                            projectName: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                            siteName: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                            lname,
                            fname,
                        };
                        if (optional_info) {
                            const {job_position,} = optional_info;
                            if (job_position) {
                                const {name, data: _data} = job_position;
                                res.jobPositionName = name || (_data ? _data.name : '');
                            }
                        }

                        return res;
                    });

                    const response = await fetch(
                        `${self.locationRoot}/templates/xlsx/Template-ToolboxTalk-Attendance-Register.xlsx`.replace('//', '/')
                    );
                    const arrayBuffer = await response.arrayBuffer();
                    const data = new Map();
                    if(client) {
                        data.set('company_name', client.name || client.data.name);
                    }
                    if(date) {
                        data.set('date', Dates.formatDate(date));
                    }
                    if(course_or_module) {
                        data.set('course', course_or_module);
                    }
                    data.set("rows", rows);
                    return await Events.emit("excelTemplate", {arrayBuffer, data});
                    // return await this.export_excel_impl(loggedUser, "Training-Toolbox-Talks-Docs", "Attendance-Register", "Attendance-Register List", cols, rows);
                }
                return item;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, course_or_module) {
            return await this.filter(evt, {course_or_module});
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

                });

                this.sortBy(list);

                const {
                    user,
                    user: {data: {client: my_client, project: my_project, site: my_site}},
                    company,
                    client_id,
                    project_id,
                    site_id
                } = loggedUser;
//                console.log(this.tbl, 'list all', client_id, project_id, site_id, 'count', list.length)
                if (my_client) {
                    list = list.filter(val => {
                        const {client, client_id: _client_id} = val.data;
                        if (!_client_id || client === "All" || !client)
                            return true;
                        return my_client.id === _client_id;
                    });
                } else if (client_id) {
                    list = list.filter(val => {
                        const {client, client_id: _client_id} = val.data;
                        if (!_client_id || client === "All" || !client)
                            return true;
                        return client_id === _client_id;
                    });
                }

//                console.log(this.tbl, 'list filtered', list)
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {course_or_module = ""} = search_val;
                const q = [
                    {key: 'course_or_module', comp: 'LIKE', val: course_or_module}
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.course_or_module");
        }
    }

    new Controller(events, db);
})();