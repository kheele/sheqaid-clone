
(() => {
    class Controller extends AControllerAssist {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {singular: "Employee Job Position", plural: "Employees  Job Positions"}, "plugin_sheq_assist/employees/job-positions/", "plugin_sheq_assist_job_positions");

            this.filter = this.filter.bind(this);
            this.search_by_name = this.search_by_name.bind(this);

            const {addAction, filter, search_by_name} = this;

            addAction("import/file", this.importFile.bind(this));
            addAction("import/create", this.createImported.bind(this));
            addAction("categories/list", this.list_categories.bind(this));
            addAction("list/filter", filter);
            addAction("list/search_by_name", search_by_name);

            this.setQueryWhere(company_id => {
                const loggedUser = self.session.getLoggedUser();
                let {company: {id}} = loggedUser;

                const list = [
                    ['company_id', '==', id]
                ];
                return list;
            });
        }
        // </editor-fold>

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
            if(updateAttrs.name) {
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

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

                });
                
                this.sortBy(list);

                const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;
//                console.log(this.tbl, 'list all', client_id, project_id, site_id, 'count', list.length)
                if (my_client) {
                    list = list.filter(val => {
                        const {client, client_id: _client_id} = val.data;
                        if (!_client_id || client === "All")
                            return true;
                        return my_client.id === _client_id;
                    });
                } else if (client_id) {
                    list = list.filter(val => {
                        const {client, client_id: _client_id} = val.data;
                        if (!_client_id || client === "All")
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

        sortBy(list) {
            list.sortBy("data.name");
        }
    }

    new Controller(events, db);
})();