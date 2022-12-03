
(() => {
    class Controller extends AControllerAssist {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events, db) {
            super(events, db, {singular: "Company / Client", plural: "Companies / Clients"}, "plugin_sheq_assist/clients/", "plugin_sheq_assist_clients");

            this.filter = this.filter.bind(this);
            this.search_by_name = this.search_by_name.bind(this);
            this.login = this.login.bind(this);
            this.logout = this.logout.bind(this);

            const {addAction, filter, search_by_name, login, logout} = this;

            addAction("list/filter", filter);
            addAction("list/search_by_name", search_by_name);
            addAction("login", login);
            addAction("logout", logout);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user, company} = loggedUser;
                const user_id = user.id;
                const company_id = company.id;
                const created_at = this.getDB().FieldValue.serverTimestamp();
                data.user_id = user_id;
                data.company_id = company_id;
                data.created_at = created_at;

                const {profile_pic} = data;
                if (profile_pic) {
                    delete data.profile_pic;
                }

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot;

                if (profile_pic) {
                    const gcsUri = await files.upload.call(this, profile_pic, async function (bucketFile) {
                        doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/' + bucketFile.name;
                        return new_name;
                    }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    const updated = await doc_ref.update({profile_pic: gcsUri});//Promise < void >
                }

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }
                data.projects = [];
                data.sites = [];

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return auditData;
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

        // <editor-fold defaultstate="collapsed" desc="login, logout">
        async login(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                loggedUser.client_id = id;
                console.log(this.tbl, 'login', id)

                return true;
            });
        }

        async logout(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                delete loggedUser.client_id;
                console.log(this.tbl, 'logout')

                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                let list = [{id: doc_snapshot.id, data: doc_snapshot.data()}];
                list = await Promise.all(list.map(mapResults(evt)));
                return list[0];
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list, filter">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.list.call(this, evt);
                list = await Promise.all(list.map(mapResults(evt)));
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

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    function mapResults(evt) {
        return async v => {
            const projects = await Events.get('plugin_sheq_assist/projects/');
            const projects_list = await projects.list(evt);
            v.data.projects = projects_list.filter(v1 => {
                const {client, client_id} = v1.data;
                if (client) {
                    return client.id === v.id;
                } else {
                    return client_id === v.id;
                }
            });
            const sites = await Events.get('plugin_sheq_assist/sites/');
            const sites_list = await sites.list(evt);
            v.data.sites = sites_list.filter(v1 => {
                const {client, client_id} = v1.data;
                if (client) {
                    return client.id === v.id;
                } else {
                    return client_id === v.id;
                }
            });
            return v;
        };
    }
    // </editor-fold>

    new Controller(events, db);
})();