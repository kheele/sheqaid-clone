(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {
                singular: "Document Category",
                plural: "Document Categories"
            }, "plugin_sheq_assist/document-categories/", "default_document_categories");

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
        async search_by_name(evt, name) {
            return await this.filter(evt, {name});
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
                const {name = ""} = search_val;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name}
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