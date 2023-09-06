
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Signature Setting", plural: "Signature Settings"}, "plugin_sheq_assist/signature-settings/", "default_signature_settings");

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
                this.injectSavable(evt, loggedUser, data);

                const {contractor_id} = loggedUser;
                let {
                    user_id,
                    //
                    client, project, site,
                    //
                    plugin, module,
                    is_employee_owning,
                    signature_settings_list,
                } = data;

                data.keywords = this.generateKeywords([plugin, module]);
                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return auditData;
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

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, module) {
            return await this.filter(evt, {module});
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
                const {
                    plugin, module,
                    is_employee_owning,
                } = search_val;
                const q = [
                    {key: 'plugin', comp: '=', val: plugin},
                    {key: 'module', comp: 'LIKE', val: module},
                    {key: 'is_employee_owning', comp: '=', val: is_employee_owning}
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.module");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="createDbFilter">
    function createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText.toLowerCase());
        };
    }

    // </editor-fold>

    new Controller(events);
})();