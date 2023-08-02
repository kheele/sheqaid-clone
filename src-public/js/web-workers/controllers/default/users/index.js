
(function () {
    class Controller extends AControllerRead {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/", "default_users");

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

        // <editor-fold defaultstate="collapsed" desc="send_app_link">
        async send_app_link(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const item = await this.find_by_id(evt, id);
                if (item) {
                    const {id, data: {password, username, fname, lname}} = item;
                    if (username) {
                        const opts = {
                            from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                            to: username,
                            subject: 'SHEQ Aid Application Link',
                            html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
                                <p>If you have not yet used SHEQ Aid Application, please use the links below to access the application.</p>\n\
                                <p>Your SHEQ Aid Username is <b>' + username + '</b>, Password is <b>' + password + '</b></p>\n\
                                ' + Utils.getAppDownloadOptionMsg()
                        };
                        await Utils.sendEmail(opts);

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

                list = await Promise.all(list.map(UserFuns.mapResults));

                const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;

                if (my_client) {
                    list = list.filter(val => {
                        return my_client.id === getClientId(val);
                    });
                } else if (client_id) {
                    list = list.filter(val => {
                        const {client} = val.data;
                        if (!client || client === "All" || !client)
                            return true;
                        return client_id === client.id;
//                        return client_id === getClientId(val);
                    });
                }

                if (my_project) {
                    list = list.filter(({data, data: {project}}) => {
                        return my_project.id === getProjectId(project, data);
                    });
                } else if (project_id) {
                    list = list.filter(({data, data: {project}}) => {
                        return project_id === getProjectId(project, data);
                    });
                }

                if (my_site) {
                    list = list.filter(({data, data: {site}}) => {
                        return my_site.id === getSiteId(site, data);
                    });
                } else if (site_id) {
                    list = list.filter(({data, data: {site}}) => {
                        return site_id === getSiteId(site, data);
                    });
                }

//                let list = await AControllerRead.prototype.listImpl.call(this, evt, opts, UserFuns.createDbFilter(searchText));
               list = await Promise.all(list.map(UserFuns.mapResults));
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, filterData, extraFilterData) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name = "", user_type} = filterData;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name},
                    {key: 'user_type', comp: '=', val: user_type}
                ];
                return this.filter_impl(evt, q);
//                
//                const {name = "", user_type} = filterData;
//                let list = await AControllerRead.prototype.listImpl.call(this, evt, null, q => {
//                    if (user_type) {
//                        q = q.where('user_type', '==', user_type);
//                    }
//                    const filter = UserFuns.createDbFilter(name);
//                    return filter(q);
//                });
//                list = await Promise.all(list.map(UserFuns.mapResults));
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
                    const filter = UserFuns.createDbFilter(name);
                    return filter(q);
                });
                list = await Promise.all(list.map(UserFuns.mapResults));
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