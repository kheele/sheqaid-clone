//const update = require('./update');
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {
                singular: "Contractor",
                plural: "Contractors"
            }, "plugin_sheq_assist/contractors/", "plugin_sheq_assist_contractors");

            const {addAction} = this;
            addAction("active/login", this.active_login.bind(this));
            addAction("active/logout", this.active_logout.bind(this));
            addAction("email/otp", this.sendContractorOTP.bind(this));
            addAction("verify/otp", this.confirmContractorOTP.bind(this));
            addAction("profile-pic", this.get_profile_pic.bind(this));
            addAction("list/filter", this.filter.bind(this));
            addAction("list/search_by_name", this.search_by_name.bind(this));

            this.setQueryWhere(company_id => {
                const loggedUser = self.session.getLoggedUser();
                let {
                    user: {data: {
                        client: my_client, project: my_project, site: my_site, contractor_id
                    }
                    },
                    client_id, project_id, site_id
                } = loggedUser;

                const list = [
                    ['company_id', '==', company_id]
                ];
                if (my_client) {
                    list.push(['client_id', '==', my_client.id]);
                } else if(client_id) {
                    list.push(['client_id', '==', client_id]);
                }
                return list;
            });
        }

        // </editor-fold>

        getDB() {
            return db2;
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, DATA) {
            return Events.whenLoggedIn(async loggedUser => {
                if (DATA.username) {
                    DATA.username = DATA.username.toLowerCase();
                }
                const {name: contractorName, username} = DATA;

                await AllUserFuns.sendCreationEmail('ContractorCreate', {
                    username,
                    contractorName
                });

                const item = await ContractorFuns.mapResults({id: doc_snapshot.id, data: DATA});
                return item;
            });
        }
        // </editor-fold>

        //<editor-fold desc="update">
        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const colRef = this.getDB().collection(this.tbl);

                const doc_ref = await colRef.doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                let {name: contractorName, username} = updateAttrs;
                if (username) {
                    updateAttrs.username = username = username.toLowerCase();

                    const docIdKey = FBSettings.FieldPath.documentId();
                    let snapshot = await colRef.where(docIdKey, '!=', id).where('username', '==', username).limit(1).get();
                    if (!snapshot.empty) {
                        return "EMAIL_DUP";
                    }
                }

                if (contractorName && username) {
                    updateAttrs.keywords = this.generateKeywords([username, contractorName]);
                } else if (contractorName && !username) {
                    updateAttrs.keywords = this.generateKeywords([snapshot.get('username'), contractorName]);
                } else if (!contractorName && username) {
                    updateAttrs.keywords = this.generateKeywords([username, snapshot.get('name')]);
                }

                console.log('contractors update', updateAttrs)

                const res = await AControllerRead.prototype.update.call(this, evt, id, updateAttrs);

                console.log('contractors update', res)
                return res;
            });
        }
        //</editor-fold>

        // <editor-fold defaultstate="collapsed" desc="active_login">
        async active_login(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                loggedUser.contractor_id = id;

                return true;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="active_logout">
        async active_logout(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                delete loggedUser.contractor_id;

                return true;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_id">
        async find_by_id(evt, uid) {
            let doc_ref = await this.getDB().collection(this.tbl).doc(uid);
            const snapshot = await doc_ref.get();
            if (!snapshot.exists) {
                return null;
            }

            let contractor = {id: snapshot.id, data: snapshot.data()};
            try {
                contractor = await ContractorFuns.mapResults(contractor);
            } catch (err) {
//                console.error(err);
            }
            return contractor;
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="find_by_username">
        async find_by_username(username, isLoggedIn = true) {
            const key = username.isEmailAddress() ? 'username' : 'phone';
            const snapshot = await this.getDB().collection(this.tbl).where(key, '==', username).limit(1).get();
            if (!snapshot || snapshot.empty) {
                return null;
            }

            const doc = snapshot.docs[0];
            let contractor = {id: doc.id, data: doc.data()};
            try {
                //if logged in
                contractor = await ContractorFuns.mapResults(contractor, isLoggedIn);
            } catch (err) {
                //if not logged in
//                console.error(err);
            }
            return contractor;
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="sendContractorOTP">
        async sendContractorOTP(evt, uid) {
            console.log('sendContractorOTP contractor')
            const sendContractorOTP = functions2.httpsCallable('callables-sendContractorOTP');
            const res = await sendContractorOTP(uid);
            if (!res || !res.data) {
                return null;
            }
            const {data} = res;
            console.log('sendContractorOTP contractor res', data)
            return data;
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="confirmContractorOTP">
        async confirmContractorOTP(evt, data) {
            console.log('confirmContractorOTP contractor')
            let {uid, code} = data;
            const confirmContractorOTP = functions2.httpsCallable('callables-confirmContractorOTP');
            const res = await confirmContractorOTP({uid, code});
            if (!res || !res.data) {
                return null;
            }
            data = res.data;
            if (isString(data)) {
                return data;
            } else {
                console.log('confirmContractorOTP res', data)
                return data;
            }
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="get_profile_pic">
        async get_profile_pic(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }
                let {profile_pic} = doc_snapshot.data();
                return profile_pic;
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

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let {
                    user: {data: {client: my_client, project: my_project, site: my_site}},
                    client_id,
                    project_id,
                    site_id
                } = self.session.getLoggedUser();
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

                });

//                console.log(1, evt, list)
                list = await Promise.all(list.map(ContractorFuns.mapResults));
//                list = await Promise.all(list.map(async item => ContractorFuns.mapResults(item)));
//                console.log(2, evt, list)

                if (my_client) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        if(!site_list) return true;
                        return site_list.anyMatch(v => v.data.client.id === my_client.id);
                    });
                } else if (client_id) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        if(!site_list) return true;
                        return site_list.anyMatch(v => v.data.client.id === client_id);
                    });
                }

                if (my_project) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        if(!site_list) return true;
                        return site_list.anyMatch(v => v.data.project.id === my_project.id);
                    });
                } else if (project_id) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        if(!site_list) return true;
                        return site_list.anyMatch(v => v.data.project.id === project_id);
                    });
                }

                if (my_site) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        if(!site_list) return true;
                        return site_list.anyMatch(v => v.id === my_site.id);
                    });
                } else if (site_id) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        if(!site_list) return true;
                        return site_list.anyMatch(v => v.id === site_id);
                    });
                }
                console.log(evt, list)
                return list;
            });
        }

        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="filter">
        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {name, username, site_name} = search_val;
                const q = [
                    {key: 'name', comp: 'LIKE', val: name},
                    {key: 'username', comp: 'LIKE', val: username},
                    {key: 'inArray(site_list.data.name)', comp: 'LIKE', val: site_name && site_name.toLowerCase()}
                ];
                return this.filter_impl(evt, q);
            });
        }

        // </editor-fold>

        sortBy() {
            return "name";
        }
    }

    new Controller(events, db2);
})();