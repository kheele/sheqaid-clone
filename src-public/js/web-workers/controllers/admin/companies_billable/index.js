
(() => {
    class Controller extends AControllerRead {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Company", plural: "Companies"}, "admin/companies/billable/");

            const {addAction} = this;

            addAction("list/filter", this.filter.bind(this));
            addAction("list/search_by_name", this.search_by_name.bind(this));

            this.setQueryWhere(company_id => {
                return [];
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, search_val) {
//            console.log('search_by_name', search_val)
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {name} = val.data;
                    return name.toLowerCase().startsWith(search_val)
                };
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                return PluginsFuns.find_billable_by_id.call(this, id);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list, filter">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                const lists = await Promise.all(['plugin_sheq_assist_clients', 'default_companies'].map(async tbl => {
                    let doc_ref = await this.getDB().collection(tbl);//Promise < DocumentReference < T > >
                    if (tbl === 'default_companies') {
                        doc_ref = doc_ref.where('consultant', '!=', true);
                    }
                    const querySnapshot = await doc_ref.get();
                    const list = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.created_at) {
                            data.created_at = data.created_at.toDate();
                        }

                        list.push({id: doc.id, data});
                    });
                    return await Promise.all(list.map(PluginsFuns.mapBillableCompanyResults.call(this, evt)));
                }));

                let list = [...lists[0], ...lists[1]];
                return list;
            });
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name} = search_val;
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

    new Controller(events);
})();