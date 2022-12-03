
(function () {
    class Controller extends AControllerRead {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Audit Log", plural: "Audit Logs"}, "audit-trail/", "default_audit_trail");

            this.filter = this.filter.bind(this);
            const {addAction, filter} = this;
            addAction("list/filter", filter);
        }

        getDB() {
            return db2;
        }

        async list(evt, opts = {}) {
            if (!opts.direction) {
                opts.direction = 'desc';
            }
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts);
                return list;
            });
        }

        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user: user_id, date_from, date_to, action, tbl} = filterData;
                let list = await AControllerRead.prototype.listImpl.call(this, evt, {direction: 'desc'}, q => {
                    if (tbl) {
                        q = q.where('tbl', '==', tbl);
                    }
                    if (action) {
                        q = q.where('action', '==', action.toLowerCase());
                    }
                    if (date_from) {
                        q = q.where('created_at', '>=', date_from);
                    }
                    if (date_to) {
                        q = q.where('created_at', '<=', date_to);
                    }
                    if (user_id) {
                        q = q.where('user.id', '==', user_id);
                    }
                    return q;
                });
                return list;
            });
        }

        sortBy() {
            return "created_at";
        }
    }

    new Controller(events, db);
})();