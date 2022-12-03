
(() => {
    class Controller extends AControllerRead {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {singular: "Scheduled Task", plural: "Scheduled Tasks"}, "admin/scheduled-tasks/", 'default_tasks');

            const {addAction} = this;

            addAction("list/filter", this.filter.bind(this));

            this.setQueryWhere(company_id => {
                return [];
            });
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="list, filter">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts);
                return list;
            });
        }

        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                let {group_name, group_key, id, status} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (group_name) {
                        q = q.where('group_name', '==', group_name);
                    }
                    if (group_key) {
                        q = q.where('group_key', '==', group_key);
                    }
                    if (id) {
                        q = q.where(firebase.firestore.FieldPath.documentId(), '==', id);
                    }
                    if (status) {
                        q = q.where('status', '==', status);
                    }
                    return q;
                });
                return list;
            });
        }
        // </editor-fold>

        sortBy() {
            return "group_name";
        }
    }

    new Controller(events, db);
})();