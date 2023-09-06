//add-activity/new
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //title, sec1
        constructor(events) {
            super(events, {singular: "Organogram", plural: "Organograms"}, "plugin_sheq_assist/StructureAndResponsibility/organograms/", "plugin_sheq_assist_StructureAndResponsibility_organograms");

            const {addAction} = this;

            addAction("list/filter", this.filter.bind(this));
            addAction("list/team/by_supervisor", this.team_list_by_supervisor.bind(this));

            this.setQueryWhere(company_id => {
                return [['company_id', '==', company_id]];
            });

            const create = async (doc) => {
                const {id} = doc;
                const data = doc.data();
                const ref = await getDB().collection(this.tbl).doc(id);

                const {client, project, site, type, _target, doc: _doc, list} = data;
                if (list) {
                    data.list = await execWhen(async () => {
                        try {
                            return await Promise.all(list.map(v => {
                                const {employee, employeeReportedTo, employee_list, team} = v;
                                if (employee_list) {
                                    v.employee_list = employee_list.map(({id, employee}) => id || employee.id);
                                }
                                return v;
                            }).map(mapCreateTeam(data, true)));
                        } catch (ex) {
                            return false;
                        }
                    });
                }
                console.log(data.list)

                await ref.set(data);
            };

            const fn = async () => {
                const doc_ref = await db.collection(this.tbl).where('company_id', '==', 'qPFSzXKRmPBUwUztZ379');//Promise < DocumentReference < T > >
                const querySnapshot = await doc_ref.get();
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc);
                });
                console.log('Organograms test', list);

                await Promise.all(list.map(async (doc) => {
                    await create(doc);
                    console.log('Organograms done', doc.id);
                }));
                console.log('Organograms final');
            };

            execWhen(async () => {
                try {
                    return await Events.whenLoggedIn(async loggedUser => {
                        return true;
                    });
                } catch (ex) {
                    //console.error('Organogram err');
                    return false;
                }
            }).then(() => {
                // console.log('Organogram 1');
                setTimeout(() => {
                    //fn();
                }, 4000);
            });
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data, updateTeams = true) {
            const {client, project, site, type, _target, doc, list} = data;

            if (list) {
                data.list = await Promise.all(list.map(mapCreateTeam(data, updateTeams)));
            }

            let newItem = await this.createAndUploadIfFile(evt, data, "doc");
            newItem = await mapResults.call(this, newItem);
            return newItem;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs, updateTeams = true) {
            const {client, project, site, type, _target, doc, list} = updateAttrs;

            if (list) {
                updateAttrs.list = await Promise.all(list.map(mapCreateTeam(updateAttrs, updateTeams)));
            }

            let updatedData = await this.updateAndUploadIfFile(evt, id, updateAttrs, "doc");
            if (updatedData) {
                let updatedItem = {id, data: updatedData};
                updatedItem = await mapResults.call(this, updatedItem);
                return updatedItem.data;
        }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {doc}}) => {
                doc && await files.remove(doc);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {
                });

                const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;
//                console.log(this.tbl, 'list all', client_id, project_id, site_id, 'count', list.length)
                if (my_client) {
                    list = list.filter(val => {
                        return my_client.id === getClientId(val);
                    });
                } else if (client_id) {
                    list = list.filter(val => {
                        const {client} = val.data;
                        if (!client || client === "All" || !client)
                            return true;
                        return client_id === client.id;
                    });
                }
                if (my_project) {
                    list = list.filter(val => {
                        const {data, data: {project}} = val;
                        return my_project.id === getProjectId(project, data);
                    });
                } else if (project_id) {
                    list = list.filter(val => {
                        const {project} = val.data;
                        if (!project || project === "All" || !project)
                            return true;
                        return project_id === project.id;
                    });
                }
                if (my_site) {
                    list = list.filter(val => {
                        const {data, data: {site}} = val;
                        return my_site.id === getSiteId(site, data);
                    });
                } else if (site_id) {
                    list = list.filter(val => {
                        const {site} = val.data;
                        if (!site || site === "All" || !site)
                            return true;
                        return site_id === site.id;
                    });
                }

                list = await Promise.all(list.map(mapResults.bind(this)));

                console.log('organograms', list)

                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {created_at, type, _target, name} = search_val;
                const q = [
                    {key: 'type', comp: '=', val: type},
                    {key: '_target', comp: '=', val: _target},
                    [
                        {key: 'client.name', comp: 'LIKE', val: name},
                        {key: 'project.name', comp: 'LIKE', val: name},
                        {key: 'site.name', comp: 'LIKE', val: name}
                    ]
                ];
                return this.filter_impl(evt, q);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_supervisor_id">
        async find_by_supervisor_id(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const mainList = await this.list(evt);
                for (let n = 0; n < mainList.length; n++) {
                    const item = mainList[n];
                    const {data: {list}} = item;
                    for (let n2 = 0; n2 < list.length; n2++) {
                        const {employeeReportedTo, employee_list, employee} = list[n2];
                        if ((employeeReportedTo && employeeReportedTo.id === id) ||
                                (employee && employee.id === id)) {
                            return item;
                        }
                    }
                }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="team_list_by_supervisor">
        async team_list_by_supervisor(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const mainList = await this.list(evt);
                for (let n = 0; n < mainList.length; n++) {
                    const {data: {list}} = mainList[n];
                    for (let n2 = 0; n2 < list.length; n2++) {
                        const {employeeReportedTo, employee_list, team} = list[n2];
                        if (employeeReportedTo && employeeReportedTo.id === id && (employee_list || team)) {
                            return employee_list || team.data.list;
                        }
                    }
                }
            });
        }
        // </editor-fold>
    }

    // <editor-fold defaultstate="collapsed" desc="mapCreateTeam">
    function mapCreateTeam(data, updateTeams) {
        const {client, project, site} = data;
        return async v => {
            let {employee, employeeReportedTo: supervisor, employee_list: list, team_id} = v;
            if (updateTeams && supervisor && isArray(list)) {
                //list = list.map(({id}) => id);
                const {id, fname, lname, data: _data} = supervisor;
                const teamData = {
                    client: client,
                    project: project,
                    site: site,
                    name: (lname || _data.lname) + ' ' + (fname || _data.fname),
                    supervisor,
                    list
                };
                console.log('mapCreateTeam0', teamData);

                console.log('mapCreateTeam1', v, list);
                delete v.employee_list;

                const teams_ctrl = await Events.get('plugin_sheq_assist/employees/teams/');
                const teamFound = await teams_ctrl.find_by_supervisor_by_id.call(teams_ctrl, null, supervisor.id);
                console.log('mapCreateTeam2 teamFound', teamFound);
                if (teamFound) {
                    try {
                        await teams_ctrl.update.call(teams_ctrl, null, teamFound.id, teamData, false);
                        v.team_id = teamFound.id;
                    } catch (err) {
                        console.error(err);
                        return;
                    }
                } else {
                    const newTeam = await teams_ctrl.create.call(teams_ctrl, null, teamData, false);
                    if (newTeam) {
                        v.team_id = newTeam.id;
                    }
                }
                console.log('mapCreateTeam3', v, list);
            }

            if (supervisor) {
                const {id, fname, lname, data: _data} = supervisor;
                v.employeeReportedTo = {id, fname: fname || _data.fname, lname: lname || _data.lname};
            }
            if (employee) {
                const {id, fname, lname, data: _data} = employee;
                v.employee = {id, fname: fname || _data.fname, lname: lname || _data.lname};
            }
            return v;
        };
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item) {
        let {
            id,
            data: {
                list,
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        if (list) {
            const employees_ctrl = await Events.get('plugin_sheq_assist/employees/');
            const teams_ctrl = await Events.get('plugin_sheq_assist/employees/teams/');
            item.data.list = await Promise.all(list.map(async ({team_id, employee_list, employee, employeeReportedTo}) => {
                const item = {};
                if (employee) {
                    item.employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, employee.id);
                }

                console.log('team_id', team_id)
                if (team_id) {
                    item.team = await teams_ctrl.find_by_id.call(teams_ctrl, null, team_id);
                    console.log('team', item.team)
                } else
                //TODO: to remove once migrated all to team_id
                if (employee_list) {
//                    console.log('employee_list', employee_list)
                    item.employee_list = await Promise.all(employee_list.map(async v => {
                        if (v.employee) {
                            return v.employee;
                        }
                        const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, v.id);
                        return employee;
                    }));
                    item.employee_list.sort((a, b) => {
//                        console.log('sort', a.data.lname, b.data.lname)
                        if (a.data.lname > b.data.lname) {
                            return 1;
                        }
                        if (a.data.lname < b.data.lname) {
                            return -1;
                        }
                        return 0;
                    });
                }
                if (employeeReportedTo) {
                    item.employeeReportedTo = await employees_ctrl.find_by_id.call(employees_ctrl, null, employeeReportedTo.id);
                }
                return item;
            }));
        }

        return item;
    }
    // </editor-fold>

    new Controller(events);
})();