
(function () {
    class Controller extends AControllerRead {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "admin/users/", "admin_users");

            this.send_app_link = this.send_app_link.bind(this);
            this.filter = this.filter.bind(this);
            this.search_by_name = this.search_by_name.bind(this);
            this.filter_by_notification_key = this.filter_by_notification_key.bind(this);

            const {addAction, send_app_link, filter, search_by_name} = this;

            addAction("send-app-link", send_app_link);
            addAction("list/filter", filter);
            addAction("list/search_by_name", search_by_name);

            this.setQueryWhere(company_id => {
                return [['company_id', '==', company_id]];
            });
        }
        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="send_app_link">
        async send_app_link(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const item = await this.find_by_id(evt, id);
                if (item) {
                    const {id, data: {password, username, fname, lname}} = item;
                    if (username) {
                        const opts = {
                            from: '"SHEQ Aid" <support@sheqsolve.com>',
                            to: username,
                            subject: 'SHEQ Aid Application Link',
                            html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
                                <p>If you have not yet used SHEQ Aid Application, please use the link below to access the application.</p>\n\
                                <p>Your SHEQ Aid Username is <b>' + username + '</b>, Password is <b>' + password + '</b></p>\n\
                                ' + Utils.getAppDownloadOptionMsg()
                        };
                        const sendEmail = functions.httpsCallable('callables-sendEmail');
                        const mailRes = await sendEmail(opts);
                        console.log('mailRes', mailRes)

                        return true;
                    }
                    return "NO_EMAIL";
                }

                return "NOT_FOUND";
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, searchText) {
            return await this.list(evt, {searchText});
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt, opts = {}) {
            let {searchText = ""} = opts;
            searchText = searchText.toLowerCase();
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

                });

                list = list.filter(({data: {fname, lname}}) => {
                    return lname.toLowerCase().startsWith(searchText) || fname.toLowerCase().startsWith(searchText);
                });

                this.sortBy(list);

                list = await Promise.all(list.map(AdminUserFuns.mapResults));

                const {user, company} = loggedUser;

//                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, AdminUserFuns.createDbFilter(searchText));
//                list = await Promise.all(list.map(AdminUserFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = ""} = filterData;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name}
                ];
                return this.filter_impl(evt, q);
//                
//                const {name = "", user_type} = filterData;
//                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
//                    if (user_type) {
//                        q = q.where('user_type', '==', user_type);
//                    }
//                    const filter = AdminUserFuns.createDbFilter(name);
//                    return filter(q);
//                });
//                list = await Promise.all(list.map(AdminUserFuns.mapResults));
//                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter_by_notification_key">
        async filter_by_notification_key(evt, key, value) {
            return Events.whenLoggedIn(async loggedUser => {
                const name = "";
                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
                    if (key) {
                        q = q.where(key, '==', value);
                    }
                    const filter = AdminUserFuns.createDbFilter(name);
                    return filter(q);
                });
                list = await Promise.all(list.map(AdminUserFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.lname");
        }
    }

    new Controller(events, db);
})();