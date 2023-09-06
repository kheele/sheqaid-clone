
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Project", plural: "Projects"}, "plugin_sheq_assist/projects/", "plugin_sheq_assist_projects");

            this.filter = this.filter.bind(this);
            this.search_by_name = this.search_by_name.bind(this);
            this.login = this.login.bind(this);
            this.logout = this.logout.bind(this);
            const {addAction, filter, search_by_name, login, logout} = this;
            addAction("list/filter", filter);
            addAction("list/search_by_name", search_by_name);
            addAction("login", login);
            addAction("logout", logout);

            this.setQueryWhere(company_id => {
                const {user: {data: {client: my_client, project: my_project, site: my_site}}, company: {id}} = self.session.getLoggedUser();
                const list = [['company_id', '==', company_id]];
                if (my_client) {
                    list.push(['client.id', '==', my_client.id]);
                }
                if (my_project) {
                    list.push(['project.id', '==', my_project.id]);
                }
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user, company, client_id} = loggedUser;
                const user_id = user.id;
                const company_id = company.id;
                const created_at = FBSettings.FieldValue.serverTimestamp();
                data.user_id = user_id;
                data.company_id = company_id;
                data.created_at = created_at;

                const {client} = data;

                if (typeof client === 'string') {
                    delete data.client;
                    if (client !== 'All') {
                        const _data = {name: client, user_id, company_id, created_at};
                        const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                        const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        data.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                        data.client_id = data.client.id;
                    }
                } else if (!client && !data.client_id && client_id) {
                    data.client_id = client_id;
                } else if (client) {
                    data.client_id = client.id;
                }

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot;

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }
                data.sites = [];

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return auditData;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="search_by_name">
        async search_by_name(evt, search_val) {
            return this.filter_by(evt, search_val, search_val => {
                return val => {
                    const {name} = val.data;
                    return name.toLowerCase().startsWith(search_val)
                };
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="login, logout">
        async login(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                loggedUser.project_id = id;
//                console.log(this.tbl, 'login', id)

                return true;
            });
        }

        async logout(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                delete loggedUser.project_id;
//                console.log(this.tbl, 'logout')

                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id, isLoggedIn = true) {
            if (isLoggedIn && !self.session.isLoggedIn()) {
                throw new Error('Not authenticated');
            }

            const doc_ref = await this.getDB().collection(this.tbl).doc(id);
            let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
            if (!doc_snapshot.exists) {
                return null;
            }

            let list = [{id: doc_snapshot.id, data: doc_snapshot.data()}];
            list = await Promise.all(list.map(mapResults(evt, isLoggedIn)));
            return list[0];
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list, filter">
        async list(evt, isLoggedIn = true) {
            if (isLoggedIn && !self.session.isLoggedIn()) {
                throw new Error('Not authenticated');
            }

            let list = await AControllerAid.prototype.list.call(this, evt);
            list = await Promise.all(list.map(mapResults(evt, isLoggedIn)));
            return list;
        }

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name, client} = search_val;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name},
                    {key: 'client.name', comp: 'LIKE', val: client}
                ];
                return this.filter_impl(evt, q);
            });
        }
        // </editor-fold>

        sortBy(list) {
            list.sortBy("data.name");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    function mapResults(evt, isLoggedIn = true) {
        return async v => {
            const sites = await Events.get('plugin_sheq_assist/sites/');
            const sites_list = await sites.list.call(sites, evt, isLoggedIn);
            v.data.sites = sites_list.filter(v1 => {
                const {project, project_id} = v1.data;
                if (project) {
                    return project.id === v.id;
                } else {
                    return project_id === v.id;
                }
            });
            return v;
        };
    }
    // </editor-fold>

    new Controller(events);
})();