
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Employee Attendance", plural: "Employees Attendances"}, "plugin_sheq_assist/employees/attendance/", "plugin_sheq_assist_attendance");

            const {addAction} = this;

            addAction("dashboard/count", this.dashboard_count.bind(this));
            addAction("list/by_team", this.list_by_team.bind(this));
            addAction("list/by_department", this.list_by_department.bind(this));
            addAction("list/by_supervisor_id", this.list_by_supervisor_id.bind(this));
            addAction("list/by_team_id", this.list_by_team_id.bind(this));
            addAction("list/by_employee_id", this.list_by_employee_id.bind(this));

            addAction("list/filter", this.filter.bind(this));
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                this.injectSavable(evt, loggedUser, data);

                let {
                    client, project, site,
                    date, day,
                    supervisor, team,
                    attendance_list, attendance_list_keys,
                    supervisor_signature, manager_signature
                } = data;

                const __date = Dates.parse(date);
                data.date_split = {
                    year: __date.getFullYear(),
                    month: __date.getMonth(),
                    date: __date.getDate(),
                    day
                };

                const res = await AControllerAid.prototype.create.call(this, evt, data);
                if (res) {
                    return await mapResults.call(this, res, logged_supervisor_id);
                }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                const {date} = updateAttrs;
                if (date) {
                    const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                    const snapshot = await doc_ref.get();
                    if (!snapshot.exists) {
                        return null;
                    }

                    const old_data = snapshot.data();
                    const {
                        date: date_old,
                        date_split: date_split_old
                    } = old_data;

                    updateAttrs.date_split = date_split_old || {};

                    const __date = Dates.parse(date);
                    updateAttrs.date_split.year = __date.getFullYear();
                    updateAttrs.date_split.month = __date.getMonth();
                    updateAttrs.date_split.date = __date.getDate();
                    updateAttrs.date_split.day = __date.getDay();
                }

                const updatedData = await AControllerAid.prototype.update.call(this, evt, id, updateAttrs);
                if (updatedData) {
                    let updatedItem = {id, data: updatedData};
                    updatedItem = await mapResults.call(this, updatedItem, logged_supervisor_id);
                    return updatedItem && updatedItem.data;
                }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="dashboard_count">
        async dashboard_count(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                return 0;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_by_supervisor_id">
        async list_by_supervisor_id(evt, id) {
            return await this.filter(evt, {supervisor: id});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_by_team_id">
        async list_by_team_id(evt, id) {
            return await this.filter(evt, {team: id});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_by_employee_id">
        async list_by_employee_id(evt, id) {
            return await this.filter(evt, {employee: id});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_by_team">
        async list_by_team(evt, args) {
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                const [id, year, month] = args;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                    q = q.where('team.id', '==', id);
                    q = q.where('date_split.year', '==', year);
                    q = q.where('date_split.month', '==', Dates.getMonthsNum(month));
                    return q;
                });

                list = await Promise.all(list.map(async item => await mapResults(item, logged_supervisor_id)));
                console.log(evt, list)
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_by_department">
        async list_by_department(evt, args) {
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                const [id, year, month] = args;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {limit: -1, direction: "desc"}, q => {
                    q = q.where('department.id', '==', id);
                    q = q.where('date_split.year', '==', year);
                    q = q.where('date_split.month', '==', Dates.getMonthsNum(month));
                    return q;
                });

                list = await Promise.all(list.map(async item => await mapResults(item, logged_supervisor_id)));
                console.log(evt, list)
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    if (logged_supervisor_id) {
                        q = q.where('supervisor.id', '==', logged_supervisor_id);
                    }
                    return q;
                });
                list = await Promise.all(list.map(async item => await mapResults(item, logged_supervisor_id)));
                console.log(evt, list)
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                const {supervisor: supervisor_id, team: team_id, employee: employee_id} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (logged_supervisor_id || supervisor_id) {
                        q = q.where('supervisor.id', '==', logged_supervisor_id || supervisor_id);
                    }
                    if (team_id) {
                        q = q.where('team.id', '==', team_id);
                    }
                    if (employee_id) {
                        q = q.where('attendance_list_keys', 'array-contains', employee_id);
                    }
                    return q;
                });
                list = await Promise.all(list.map(async item => await mapResults(item, logged_supervisor_id)));
                return list;
            });
        }
        // </editor-fold>

        sortBy() {
            return "date";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item, logged_supervisor_id) {
        let {
            id,
            data: {
                date, date_split,
                day,
                attendance_list,
                attendance_list_keys,
                team,
                supervisor,
                supervisor_signature,
                manager_signature,
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        const promise = [];

        if (!logged_supervisor_id) {
            promise.push(Events.get('plugin_sheq_assist/employees/').then(employees_ctrl => {
                return employees_ctrl.find_by_id.call(employees_ctrl, null, supervisor.id);
            }).then(val => {
                item.data.supervisor = val;
            }));
        }

        if (team && !team.data) {
            promise.push(Events.get('plugin_sheq_assist/employees/teams/').then(teams_ctrl => {
                return teams_ctrl.find_by_id.call(teams_ctrl, null, team.id);
            }).then(val => {
                item.data.team = val;
            }));
        }

        promise.push(Events.get('plugin_sheq_assist/employees/').then(employees_ctrl => {
            return Promise.all(attendance_list.map(async v => {
                v.employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, v.employee.id);
                return v;
            }));
        }).then(val => {
            item.data.attendance_list = val;
        }));

        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site) && !site.data) || site_id) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
            }).then(val => {
                item.data.site = val;
            }));
        }

        await Promise.all(promise);

        return item;
    }
    // </editor-fold>

    new Controller(events);
})();