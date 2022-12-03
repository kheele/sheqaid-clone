
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {singular: "Employee Team", plural: "Employees Teams"}, "plugin_sheq_assist/employees/teams/", "plugin_sheq_assist_teams");

            const {addAction} = this;

            addAction("find/by_supervisor_by_id", this.find_by_supervisor_by_id.bind(this));
            addAction("dashboard/count", this.dashboard_count.bind(this));
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/filter", this.filter.bind(this));
            addAction("list/ppe-matrix", this.filter_ppe_matrix.bind(this));
            
            const transfer = async () => {
                const col_ref = await db2.collection(this.tbl).where('company_id', '==', 'qPFSzXKRmPBUwUztZ379');//Promise < DocumentReference < T > >
                const querySnapshot = await col_ref.get();
                await Promise.all(querySnapshot.docs.map(async (doc) => {
                    const ref = await db_hr.collection(this.tbl).doc(doc.id);

                    await ref.set(doc.data(), {merge: true});

//                    await doc.ref.delete();
//                    console.log('doc deleted', doc.id);                    
                    console.log('doc moved', doc.id);
                }));
                console.log(this.tbl, 'final');
            };
            transfer();
        }
        // </editor-fold>

        getDB() {
            return db_hr;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data, updateOrganogram = true) {
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                this.injectSavable(evt, loggedUser, data);

                let {
                    client, project, site,
                    name, supervisor: supervisor_name, list, ppe_list = [], status
                } = data;
                if (!status) {
                    data.status = 'Active';
                }
                ppe_list = ppe_list.filter(v => !!v);

                name = name || (supervisor_name.lname + " " + supervisor_name.fname);
                data.keywords = this.generateKeywords([name, supervisor_name.lname, supervisor_name.fname]);
                const doc_ref_supervisor_name = db_hr.collection(TBL_EMPLOYEES).doc(supervisor_name.id);

                data.list = await db_hr.runTransaction(async transaction => {
                    const snapshot_supervisor_name = await transaction.get(doc_ref_supervisor_name);
                    if (!snapshot_supervisor_name.exists) {
                        throw "Document does not exist!";
                    }

                    const {phone: supervisor_phone, email: supervisor_email} = snapshot_supervisor_name.data();

                    return Promise.all(list.map(async memberId => {
                        const doc_ref = db_hr.collection(TBL_EMPLOYEES).doc(memberId);
                        const snapshot = await transaction.get(doc_ref);
                        if (!snapshot.exists) {
                            throw "Document does not exist!";
                        }

                        const {optional_info = {}} = snapshot.data();
                        optional_info.supervisor_name = supervisor_name;
                        optional_info.supervisor_phone = supervisor_phone;
                        optional_info.supervisor_email = supervisor_email;

                        transaction.update(doc_ref, {optional_info});
                        return memberId;
                    }));
                });

                const res = await AControllerAid.prototype.create.call(this, evt, data);

                if (res) {
                    await createOrganogram(res, supervisor_name, updateOrganogram);

                    await Events.get('plugin_sheq_assist/employees/ppe/').then(ppe_ctrl => {
                        return Promise.all(ppe_list.map(async id => {
                            return ppe_ctrl.add_team.call(ppe_ctrl, id, res.id);
                        }));
                    });

                    return await mapResults.call(this, res, logged_supervisor_id);
                }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs, updateOrganogram = true) {
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const old_data = snapshot.data();
                let {created_at, ppe_list: old_ppe_list = []} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                let {
                    name,
                    supervisor: supervisor_name,
                    list,
                    ppe_list
                } = updateAttrs;

                if (ppe_list) {
                    ppe_list = ppe_list.filter(v => !!v);
                    await Events.get('plugin_sheq_assist/employees/ppe/').then(ppe_ctrl => {
                        const new_ppe_list = ppe_list.filter(id => !old_ppe_list.contains(id));
                        const removed_ppe_list = old_ppe_list.filter(id => !ppe_list.contains(id));
                        return Promise.all([
                            Promise.all(new_ppe_list.map(async id => {
                                return ppe_ctrl.add_team.call(ppe_ctrl, id, snapshot.id);
                            })),
                            Promise.all(removed_ppe_list.map(async id => {
                                return ppe_ctrl.remove_team.call(ppe_ctrl, id, snapshot.id);
                            }))
                        ]);
                    });
                }

                if (supervisor_name) {
                    if (name && supervisor_name.lname && supervisor_name.fname) {
                        updateAttrs.keywords = this.generateKeywords([name, supervisor_name.lname, supervisor_name.fname]);
                    } else if (name && !supervisor_name.lname && !supervisor_name.fname) {
                        updateAttrs.keywords = this.generateKeywords([name, snapshot.get('supervisor').lname, snapshot.get('supervisor').fname]);
                    } else if (!name && supervisor_name.lname && !supervisor_name.fname) {
                        updateAttrs.keywords = this.generateKeywords([snapshot.get('name'), supervisor_name.lname, snapshot.get('supervisor').fname]);
                    } else if (!name && !supervisor_name.lname && supervisor_name.fname) {
                        updateAttrs.keywords = this.generateKeywords([snapshot.get('name'), snapshot.get('supervisor').lname, supervisor_name.fname]);
                    } else if (name && supervisor_name.lname && !supervisor_name.fname) {
                        updateAttrs.keywords = this.generateKeywords([name, supervisor_name.lname, snapshot.get('supervisor').fname]);
                    } else if (name && !supervisor_name.lname && supervisor_name.fname) {
                        updateAttrs.keywords = this.generateKeywords([name, snapshot.get('supervisor').lname, supervisor_name.fname]);
                    } else if (!name && supervisor_name.lname && supervisor_name.fname) {
                        updateAttrs.keywords = this.generateKeywords([snapshot.get('name'), supervisor_name.lname, supervisor_name.fname]);
                    }
                } else if (name) {
                    updateAttrs.keywords = this.generateKeywords([name, snapshot.get('supervisor').lname, snapshot.get('supervisor').fname]);
                }

                if (list) {
                    supervisor_name = supervisor_name || snapshot.get('supervisor');
                    const doc_ref_supervisor_name = db_hr.collection(TBL_EMPLOYEES).doc(supervisor_name.id);

                    updateAttrs.list = await db_hr.runTransaction(async transaction => {
                        const snapshot_supervisor_name = await transaction.get(doc_ref_supervisor_name);
                        if (!snapshot_supervisor_name.exists) {
                            throw "Document does not exist!";
                        }

                        const {phone: supervisor_phone, email: supervisor_email} = snapshot_supervisor_name.data();

                        return Promise.all(list.map(async memberId => {
                            const doc_ref = db_hr.collection(TBL_EMPLOYEES).doc(memberId);
                            const snapshot = await transaction.get(doc_ref);
                            if (!snapshot.exists) {
                                throw "Document does not exist!";
                            }

                            const {optional_info = {}} = snapshot.data();
                            optional_info.supervisor_name = supervisor_name;
                            optional_info.supervisor_phone = supervisor_phone;
                            optional_info.supervisor_email = supervisor_email;

                            transaction.update(doc_ref, {optional_info});
                            return memberId;
                        }));
                    });
                }

                let updatedData = await AControllerAid.prototype.update.call(this, evt, id, updateAttrs);

                if (updatedData) {
                    let updatedItem = {id, data: updatedData};

                    await createOrganogram(updatedItem, updatedData.supervisor, updateOrganogram);

                    updatedItem = await mapResults.call(this, updatedItem, logged_supervisor_id);
                    return updatedItem.data;
                }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="add_ppe_item, remove_ppe_item">
        async update_ppe_item_impl(action, id, ppe_item_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const updated = await doc_ref.update({ppe_list: FBSettings.FieldValue['array' + action](ppe_item_id)});//Promise < void >

                return true;
            });
        }

        async add_ppe_item(id, ppe_item_id) {
            return this.update_ppe_item_impl('Union', id, ppe_item_id);
        }

        async remove_ppe_item(id, ppe_item_id) {
            return this.update_ppe_item_impl('Remove', id, ppe_item_id);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                const item = await AControllerRead.prototype.find_by_id.call(this, evt, id);
                if (item) {
                    return await mapResults(item, logged_supervisor_id);
                }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_supervisor_by_id">
        async find_by_supervisor_by_id(evt, id) {
            const list = await this.filter(evt, {supervisor: id});
            if (!list.isEmpty()) {
                return list[0];
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="dashboard_count">
        async dashboard_count(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    user: {data: {client: my_client, project: my_project, site: my_site}},
                    company: {id: company_id},
                    client_id, project_id, site_id
                } = loggedUser;

                let q = this.getDB().collection('plugin_sheq_assist_teams_counters');

                let key;
                site_id = my_site ? my_site.id : site_id;
                if (site_id) {
                    q = q.doc(`site`);
                    key = site_id;
                } else {
                    project_id = my_project ? my_project.id : project_id;
                    if (project_id) {
                        q = q.doc(`project`);
                        key = project_id;
                    } else {
                        client_id = my_client ? my_client.id : client_id;
                        if (client_id) {
                            q = q.doc(`client`);
                            key = client_id;
                        } else {
                            q = q.doc(`company`);
                            key = company_id;
                        }
                    }
                }

                const snapshot = await q.get();
                if (snapshot.exists) {
                    return snapshot.get(key);
                }
                return 'N/A';
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, name) {
            return await this.filter(evt, {name});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    q = q.where('status', '==', "Active");
                    return q.where("keywords", "array-contains", searchText);
                });
                list = await Promise.all(list.map(async item => await mapResults(item, logged_supervisor_id)));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {logged_supervisor_id} = loggedUser;
                const {name = "", supervisor: supervisor_id, employee: employee_id} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    q = q.where('status', '==', "Active");
                    if (supervisor_id) {
                        q = q.where('supervisor.id', '==', supervisor_id);
                    }
                    if (employee_id) {
                        q = q.where('list', 'array-contains', employee_id);
                    }
                    return q.where("keywords", "array-contains", name);
                });
                list = await Promise.all(list.map(async item => await mapResults(item, logged_supervisor_id)));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_ppe_matrix">
        async filter_ppe_matrix(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {client_id, project_id, site_id} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    q = q.where('status', '==', "Active");
                    if (site_id) {
                        return q.where('site_id', '==', site_id);
                    }
                    if (project_id) {
                        return q.where('project_id', '==', project_id);
                    }
                    if (client_id) {
                        return q.where('client_id', '==', client_id);
                    }
                });
                list = await Promise.all(list.map(async item => await mapResults(item)));
                return list;
            });
        }
        // </editor-fold>

        sortBy() {
            return "name";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="createOrganogram">
    async function createOrganogram(team, supervisor_name, updateOrganogram) {
        if (updateOrganogram) {
            const organograms_ctrl = await Events.get('plugin_sheq_assist/StructureAndResponsibility/organograms/');
            const organogram = await organograms_ctrl.find_by_supervisor_id.call(organograms_ctrl, null, supervisor_name.id);
            if (organogram) {
                let {data: {
                        list: organogramList
                                //{employeeReportedTo, employee_list}
                    }
                } = organogram;
                const find = (organogramList, mapper) => {
                    return organogramList.find(mapper);
                };
                const listItemReportedTo = find(organogramList, ({employeeReportedTo}) => {
                    return (employeeReportedTo && employeeReportedTo.id === supervisor_name.id);
                });
                if (listItemReportedTo) {
                    listItemReportedTo.team_id = team.id;
                } else {
                    const listItemEmployee = find(organogramList, ({employee}) => {
                        return (employee && employee.id === supervisor_name.id);
                    });
                    if (listItemEmployee) {
                        organogramList.push({team_id: team.id, employeeReportedTo: listItemEmployee.employee});
                    }
                }

                const organogramData = {list: organogramList};
                await organograms_ctrl.update.call(organograms_ctrl, null, organogram.id, organogramData, false);
            }
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item, logged_supervisor_id) {
        let {
            id,
            data: {
                supervisor,
                list,
                ppe_list = [],
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

        promise.push(Events.get('plugin_sheq_assist/employees/').then(employees_ctrl => {
            return Promise.all(list.filter(v => !!v).map(async memberId => {
                const actions = [
                    {
                        path: 'plugin_sheq_assist/COVID_Management/screening/',
                        fn: 'list_by_employee_id',
                        key: 'covid_screening_list',
                        args: [memberId]
                    }
                ];
                const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, memberId, actions);
                return employee;
            }));
        }).then(val => {
            val.sortBy('data.lname');
            item.data.list = val;
        }));

        if (ppe_list) {
            ppe_list = ppe_list.filter(v => !!v);
            promise.push(Events.get('plugin_sheq_assist/employees/ppe/').then(ppe_ctrl => {
                return Promise.all(ppe_list.filter(v => !!v).map(async id => {
                    return ppe_ctrl.find_by_id.call(ppe_ctrl, null, id);
                }));
            }).then(val => {
                val.sortBy('data.name');
                item.data.ppe_list = val;
            }));
        }

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

    new Controller(events, db);
})();