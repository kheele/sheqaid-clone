
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Employee Job Position", plural: "Employees  Job Positions"}, "plugin_sheq_assist/employees/job-positions/", "plugin_sheq_assist_job_positions");

            const {addAction} = this;

            addAction("import/file", this.importFile.bind(this));
            addAction("import/create", this.createImported.bind(this));
            addAction("dashboard/count", this.dashboard_count.bind(this));
            addAction("categories/list", this.list_categories.bind(this));
            addAction("list/search_by_name", this.search_by_name.bind(this));
            addAction("list/filter", this.filter.bind(this));
            addAction("list/ppe-matrix", this.filter_ppe_matrix.bind(this));

            this.setQueryWhere(company_id => {
                return [['company_id', '==', company_id]];
            });

            const transfer = async () => {
                const col_ref = await db.collection(this.tbl);//.where('company_id', '==', 'qPFSzXKRmPBUwUztZ379');//Promise < DocumentReference < T > >
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
            // transfer();
        }
        // </editor-fold>

        getDB() {
            return db_hr;
        }

        // <editor-fold defaultstate="collapsed" desc="importFile">
        async importFile(evt, path) {
            const validHeaderNames = [
                {key: 'name', value: ['Job Position', 'Job Title', 'Job Name'], required: true},
                {key: 'job_category', value: ['Job Category', 'Occupational Level']}
            ];
            const res = await excelUtils.read(path, validHeaderNames);
            if (res.errors)
                return res;

            res.sortBy('name');
            return res.distinct('name');
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="createImported">
        async createImported(evt, list) {
            return Events.whenLoggedIn(async loggedUser => {
                return await Promise.all(list.map(async data => {
                    return await this.create(evt, data);
                }));
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);

                const {name, client, user_id, company_id, created_at} = data;
                data.name = name.toLowerCase().toCapitalCase();
                if (typeof client === 'string') {
                    delete data.client;
                    if (client !== 'All') {
                        const _data = {name: client, user_id, company_id, created_at};
                        const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                        const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        data.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                        data.client_id = client_doc_snapshot.id;
                    }
                } else if (client) {
                    data.client_id = client.id;
                }
                return await this.createAndUploadIfFile(evt, data, "doc");
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="update">
        async update(evt, id, updateAttrs) {
            if (updateAttrs.name) {
                updateAttrs.name = updateAttrs.name.toLowerCase().toCapitalCase();
            }
            return await this.updateAndUploadIfFile(evt, id, updateAttrs, "doc");
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, ids) {
            if (!isArray(ids)) {
                ids = [ids];
            }
            const res = await Promise.all(ids.map(async id => {
                return this.removeWithFile(evt, id, async ({data: {doc}}) => {
                    doc && await files.remove(doc);
                });
            }));
            return res;
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

        // <editor-fold defaultstate="collapsed" desc="dashboard_count">
        async dashboard_count(evt, opts = {}) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    user: {data: {client: my_client, project: my_project, site: my_site}},
                    company: {id: company_id},
                    client_id, project_id, site_id
                } = loggedUser;

                let q = this.getDB().collection('plugin_sheq_assist_job_positions_counters');

                let key;
                client_id = my_client ? my_client.id : client_id;
                if (client_id) {
                    q = q.doc(`client`);
                    key = client_id;
                } else {
                    q = q.doc(`company`);
                    key = company_id;
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
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

                });

                list = await Promise.all(list.map(mapResults));

                this.sortBy(list);

                const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;
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

//            console.log(this.tbl, 'list filtered', list.length)
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list_categories">
        async list_categories(evt) {
            let list = await AControllerRead.prototype.list.call(this, evt);
            return list.filter(({data}) => {
                return !!data.job_category;
            }).map(({data}) => {
                return data.job_category;
            }).distinct();
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, name) {
            return await this.filter(evt, {name});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = ""} = search_val;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name.toLowerCase()}
                ];
                return this.filter_impl(evt, q);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_ppe_matrix">
        async filter_ppe_matrix(evt, filterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {client_id, project_id, site_id} = filterData;
                if (site_id) {
                    return this.filter_impl(evt, [{key: 'site_id', comp: '==', val: site_id}]);
                }
                if (project_id) {
                    return this.filter_impl(evt, [{key: 'project_id', comp: '==', val: project_id}]);
                }
                if (client_id) {
                    return this.filter_impl(evt, [{key: 'client_id', comp: '==', val: client_id}]);
                }
            });
        }
        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.name");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item) {
        let {
            id,
            data: {
                ppe_list = []
            }
        } = item;

        const promise = [];

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

        await Promise.all(promise);

        return item;
    }
    // </editor-fold>

    new Controller(events);
})();