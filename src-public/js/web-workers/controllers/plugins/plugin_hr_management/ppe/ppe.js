
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Employee PPE", plural: "Employees PPEs"}, "plugin_sheq_assist/employees/ppe/", "plugin_sheq_assist_ppe");

            const {addAction} = this;

            addAction("dashboard/count", this.dashboard_count.bind(this));
            //addAction("find/by_supervisor_by_id", this.find_by_supervisor_by_id.bind(this));
            addAction("list/filter", this.filter.bind(this));
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data, updateOrganogram = true) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);

                let {
                    client, project, site,
                    profile_pic, name, unit, qty_received, qty_issued, qty_in_stock, duration_type, duration_value,
                    team_list = [],
                    department_list = [],
                    job_position_list = []
                } = data;
                if (profile_pic) {
                    delete data.profile_pic;
                }

                data.keywords = this.generateKeywords([name]);
                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                await Events.get('plugin_sheq_assist/employees/teams/').then(teams_ctrl => {
                    return Promise.all(team_list.map(async id => {
                        return teams_ctrl.add_ppe_item.call(teams_ctrl, id, doc_snapshot.id);
                    }));
                });

                await Events.get('plugin_sheq_assist/employees/departments/').then(departments_ctrl => {
                    return Promise.all(department_list.map(async id => {
                        return departments_ctrl.add_ppe_item.call(departments_ctrl, id, doc_snapshot.id);
                    }));
                });

                await Events.get('plugin_sheq_assist/employees/job-positions/').then(job_positions_ctrl => {
                    return Promise.all(job_position_list.map(async id => {
                        return job_positions_ctrl.add_ppe_item.call(job_positions_ctrl, id, doc_snapshot.id);
                    }));
                });

                if (profile_pic) {
                    const gcsUri = await files.upload.call(this, profile_pic, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    const updated = await doc_ref.update({profile_pic: gcsUri});//Promise <void>
                }

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                let auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                auditData = await mapResults.call(this, auditData);
                return auditData;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const old_data = snapshot.data();
                let {
                    created_at,
                    team_list: old_team_list = [],
                    department_list: old_department_list = [],
                    job_position_list: old_job_position_list = []
                } = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                const {name, duration_type, duration_value, profile_pic, team_list, department_list, job_position_list} = updateAttrs;

                if (team_list) {
                    await Events.get('plugin_sheq_assist/employees/teams/').then(teams_ctrl => {
                        const new_team_list = team_list.filter(id => !old_team_list.contains(id));
                        const removed_team_list = old_team_list.filter(id => !team_list.contains(id));
                        return Promise.all([
                            Promise.all(new_team_list.map(async id => {
                                return teams_ctrl.add_ppe_item.call(teams_ctrl, id, snapshot.id);
                            })),
                            Promise.all(removed_team_list.map(async id => {
                                return teams_ctrl.remove_ppe_item.call(teams_ctrl, id, snapshot.id);
                            }))
                        ]);
                    });
                }

                if (department_list) {
                    await Events.get('plugin_sheq_assist/employees/departments/').then(departments_ctrl => {
                        const new_department_list = department_list.filter(id => !old_department_list.contains(id));
                        const removed_department_list = old_department_list.filter(id => !department_list.contains(id));
                        return Promise.all([
                            Promise.all(new_department_list.map(async id => {
                                return departments_ctrl.add_ppe_item.call(departments_ctrl, id, snapshot.id);
                            })),
                            Promise.all(removed_department_list.map(async id => {
                                return departments_ctrl.remove_ppe_item.call(departments_ctrl, id, snapshot.id);
                            }))
                        ]);
                    });
                }

                if (job_position_list) {
                    await Events.get('plugin_sheq_assist/employees/job-positions/').then(job_positions_ctrl => {
                        const new_job_position_list = job_position_list.filter(id => !old_job_position_list.contains(id));
                        const removed_job_position_list = old_job_position_list.filter(id => !job_position_list.contains(id));
                        return Promise.all([
                            Promise.all(new_job_position_list.map(async id => {
                                return job_positions_ctrl.add_ppe_item.call(job_positions_ctrl, id, snapshot.id);
                            })),
                            Promise.all(removed_job_position_list.map(async id => {
                                return job_positions_ctrl.remove_ppe_item.call(job_positions_ctrl, id, snapshot.id);
                            }))
                        ]);
                    });
                }

                if (name) {
                    updateAttrs.keywords = this.generateKeywords([name]);
                }

                if (profile_pic) {
                    const gcsUri = await files.upload.call(this, profile_pic, async function (bucketFile) {
                        const new_name = this.tbl + '/' + snapshot.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                        throw e;
                    });
                    updateAttrs.profile_pic = gcsUri;
                }

                const updated = await doc_ref.set(updateAttrs, {merge: true});//Promise < void >
                snapshot = await doc_ref.get();

                let data = snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                let updatedItem = {id: snapshot.id, data};
                updatedItem = await mapResults.call(this, updatedItem);

                const auditData = {id: snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

//                console.log('update', data, updatedItem)
                return updatedItem.data;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="add_team, remove_team">
        async update_team_impl(action, id, team_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const updated = await doc_ref.update({team_list: FBSettings.FieldValue['array' + action](team_id)});//Promise < void >

                return true;
            });
        }

        async add_team(id, team_id) {
            return this.update_team_impl('Union', id, team_id);
        }

        async remove_team(id, team_id) {
            return this.update_team_impl('Remove', id, team_id);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="add_department, remove_department">
        async update_department_impl(action, id, department_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const updated = await doc_ref.update({department_list: FBSettings.FieldValue['array' + action](department_id)});//Promise < void >

                return true;
            });
        }

        async add_department(id, department_id) {
            return this.update_department_impl('Union', id, department_id);
        }

        async remove_department(id, department_id) {
            return this.update_department_impl('Remove', id, department_id);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="add_job_position, remove_job_position">
        async update_job_position_impl(action, id, job_position_id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const updated = await doc_ref.update({job_position_list: FBSettings.FieldValue['array' + action](job_position_id)});//Promise < void >

                return true;
            });
        }

        async add_job_position(id, job_position_id) {
            return this.update_job_position_impl('Union', id, job_position_id);
        }

        async remove_job_position(id, job_position_id) {
            return this.update_job_position_impl('Remove', id, job_position_id);
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

                let q = this.getDB().collection(`plugin_sheq_assist_ppe_counters`);

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

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, q => {
                    return q.where("keywords", "array-contains", searchText);
                });
                list = await Promise.all(list.map(mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", team: team_id, department: department_id, job_position: job_position_id} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (team_id) {
                        q = q.where('team_list', 'array-contains', team_id);
                    }
                    if (department_id) {
                        q = q.where('department_list', 'array-contains', department_id);
                    }
                    if (job_position_id) {
                        q = q.where('job_position_list', 'array-contains', job_position_id);
                    }
                    return q.where("keywords", "array-contains", name);
                });
                list = await Promise.all(list.map(mapResults));
                return list;
            });
        }
        // </editor-fold>

        sortBy() {
            return "name";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item) {
        let {
            id,
            data: {
                name, unit, qty_received, qty_issued, qty_in_stock, duration_type, duration_value, notes, profile_pic,
                team_list = [],
                department_list = [],
                job_position_list = [],
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        const promise = [];

        if (team_list) {
            team_list = team_list.filter(v => !!v);
            promise.push(Events.get('plugin_sheq_assist/employees/teams/').then(teams_ctrl => {
                console.log('team_list', team_list);
                return Promise.all(team_list.map(async id => {
                    return teams_ctrl.find_by_id.call(teams_ctrl, null, id);
                }));
            }).then(val => {
                val.sortBy('data.name');
                item.data.team_list = val;
            }));
        }

        if (department_list) {
            department_list = department_list.filter(v => !!v);
            promise.push(Events.get('plugin_sheq_assist/employees/departments/').then(departments_ctrl => {
                console.log('department_list', department_list);
                return Promise.all(department_list.map(async id => {
                    return departments_ctrl.find_by_id.call(departments_ctrl, null, id);
                }));
            }).then(val => {
                val.sortBy('data.name');
                item.data.department_list = val;
            }));
        }

        if (job_position_list) {
            job_position_list = job_position_list.filter(v => !!v);
            promise.push(Events.get('plugin_sheq_assist/employees/job-positions/').then(job_positions_ctrl => {
                console.log('job_position_list', job_position_list);
                return Promise.all(job_position_list.map(async id => {
                    return job_positions_ctrl.find_by_id.call(job_positions_ctrl, null, id);
                }));
            }).then(val => {
                val.sortBy('data.name');
                item.data.job_position_list = val;
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

    new Controller(events);
})();