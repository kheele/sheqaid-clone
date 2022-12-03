
//const update = require('./update');
(() => {
    class Controller extends AControllerAssist {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Contractor", plural: "Contractors"}, "plugin_sheq_assist/contractors/", "plugin_sheq_assist_contractors");

            const {addAction} = this;
            addAction("login", this.login.bind(this));
            addAction("active/login", this.active_login.bind(this));
            addAction("login-auto", this.loginAuto.bind(this));
            addAction("logout", this.logout.bind(this));
            addAction("active/logout", this.active_logout.bind(this));
            addAction("profile-pic", this.get_profile_pic.bind(this));
            addAction("list/filter", this.filter.bind(this));
            addAction("list/search_by_name", this.search_by_name.bind(this));

            this.setQueryWhere(company_id => {
                const loggedUser = self.session.getLoggedUser();
                let {company: {id}} = loggedUser;

                const list = [
                    ['company_id', '==', id]
                ];
                return list;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, DATA) {
            return Events.whenLoggedIn(async loggedUser => {
                const {username} = DATA;

                // <editor-fold defaultstate="collapsed" desc="data collection">
                let snapshot = await this.getDB().collection(this.tbl).where('username', '==', username).limit(1).get();
                if (!snapshot.empty) {
                    return "EMAIL_DUP";
                }

                this.injectSavable(evt, loggedUser, DATA);
                const {user_id, company_id, created_at} = DATA;

                const {site_list, project, client, profile_pic} = DATA;

                DATA.site_list = site_list.map(({id, data: {name}}) => {
                    return {id, name};
                });

                let password = uuidv4();
                password = password.substring(0, password.indexOf('-'));
                DATA.password = password;
                // </editor-fold>

                const save = async (userCredential) => {
                    const {uid} = userCredential.user;
                    await authGeneral.signOut();

                    console.log('contractors create userCredential', uid, DATA)

                    await this.getDB().collection(this.tbl).doc(uid).set(DATA);//Promise < DocumentReference < T > >;
                    const doc_ref = await this.getDB().collection(this.tbl).doc(uid);//Promise < DocumentReference < T > >;
                    const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;

                    DATA = doc_snapshot.data();
                    DATA.created_at = DATA.created_at.toDate();

                    const opts = {
                        from: '"SHEQ Assist" <support@sheqsolve.com>',
                        to: username,
                        subject: 'Welcome to SHEQ Assist',
                        html: '<h3><b>Dear ' + DATA.name + '</b></h3>\n\
                                            <p>Your account was recently created on SHEQ Assist.</p>\n\
                                            <p>Your SHEQ Assist Username is <b>' + username + '</b>, Password is <b>' + password + '</b> and User Type is <b>Contractor</b></p>\n\
                                            <p>You are strongly adviced to change your password as soon as you login in to SHEQ Assist account</p>\n\
                                            <p>Please click <a href="https://sheqsolve.web.app/updater/sheqsolve-1.0.0.exe">here</a> to download the application and use the above username and password to login.</p>\n\
                                            <p>Kind Regards<br/>SHEQ Assist</p>'
                    };

                    console.log('callables-sendEmail', opts)
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)

                    return {id: doc_snapshot.id, data: DATA};
                };

                try {
                    return await authGeneral.createUserWithEmailAndPassword(username, password).then(save);
                } catch (err) {
                    if (err.code === "auth/email-already-in-use") {
                        return await authGeneral.signInWithEmailAndPassword(username, password).then(save);
                    } else {
                        console.error(err);
                        throw err;
                    }
                }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="login">
        async login(evt, data) {
            this.selfLogin = true;
            const {username, password} = data;
//            await auth.signOut();
            const res = await auth.signInWithEmailAndPassword(username, password).then(async userCredential => {
                if (!userCredential)
                    return false;
                const {user} = userCredential;
//                await onLogin();
                return this.loginImpl(user.uid);
            }).catch(err => {
                console.error('login', err)
                if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                    return null;
                } else if (err.code === "auth/too-many-requests") {
                    return err.code;
                } else if (err.code === "auth/network-request-failed") {
                    return this.loginImplLocal(username, password).then(loggedUser => {
                        //Events.emit(this.root + 'login', loggedUser);
                        return loggedUser;
                    });
//                    throw new Error("AUTH-NETWORK-ERROR");
                } else {
                    throw err;
                }
            });
//            console.log('login', res)
            return res;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="active_login">
        async active_login(evt, id) {
            return Events.whenLoggedIn(async loggedUser => {
                loggedUser.contractor_id = id;

                return true;
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="login-auto">
        async loginAuto(evt) {
//            this.selfLogin = false;
            const {currentUser} = firebase.auth();
            if (!currentUser)
                return null;
            await onLogin();
            return this.loginImpl(currentUser.uid);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="loginImplLocal">
        async loginImplLocal(username, password) {
            let snapshot;
            if (password) {
                snapshot = await this.getDB().collection(this.tbl).where('username', '==', username).where('password', '==', password).limit(1).get();
            } else {
                snapshot = await this.getDB().collection(this.tbl).where('username', '==', username).limit(1).get();
            }
            if (snapshot.empty) {
                return null;
            } else {
                let db_user = snapshot.docs.map(doc => {
                    return {id: doc.id, data: doc.data()};
                })[0];
                //company_name, company_phone, country, zone
                let db_company = await this.getDB().collection('default_companies').doc(db_user.data.company_id).get();

                const company_data = db_company.data();
                company_data.created_at = company_data.created_at.toDate();
                if (company_data.trial_start_date) {
                    company_data.trial_start_date = company_data.trial_start_date.toDate();
                }

                db_company = {id: db_company.id, data: company_data};
                const res = {user: db_user, company: db_company, access_type: 'Contractor'};

                self.session.loginUser(res);

                res.user = await mapResults(db_user);

                await this.active_login(db_user.id);

                self.session.loginUser(res);

                return res;
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="loginImpl">
        async loginImpl(uid) {
            let doc_ref = await this.getDB().collection(this.tbl).doc(uid);
            const snapshot = await doc_ref.get();
            console.log('loginImpl', snapshot.exists)
            if (!snapshot.exists) {
                return null;
            } else {
                let db_user = {id: snapshot.id, data: snapshot.data()};
                //company_name, company_phone, country, zone
                let db_company = await this.getDB().collection('default_companies').doc(db_user.data.company_id).get();

                const company_data = db_company.data();
                company_data.created_at = company_data.created_at.toDate();
                if (company_data.trial_start_date) {
                    company_data.trial_start_date = company_data.trial_start_date.toDate();
                }

                db_company = {id: db_company.id, data: company_data};
                const res = {user: db_user, company: db_company, access_type: 'Contractor'};

                self.session.loginUser(res);

                try {
                    res.user = await mapResults(db_user);
                } catch (err) {
                    console.error('loginImpl', err);
                }

                await this.active_login(db_user.id);

                self.session.loginUser(res);

                return res;
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="logout">
        async logout(evt) {
            return Events.whenLoggedIn(loggedUser => {
                self.session.logout();
                return auth.signOut().then(() => true);
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
                let {user: {data: {client: my_client, project: my_project, site: my_site}}, client_id, project_id, site_id} = self.session.getLoggedUser();
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

                });

                console.log(1, evt, list.length)
                list = await Promise.all(list.map(mapResults));

                if (my_client) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        return site_list.anyMatch(v => v.data.client.id === my_client.id);
                    });
                } else if (client_id) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        return site_list.anyMatch(v => v.data.client.id === client_id);
                    });
                }

                if (my_project) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        return site_list.anyMatch(v => v.data.project.id === my_project.id);
                    });
                } else if (project_id) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        return site_list.anyMatch(v => v.data.project.id === project_id);
                    });
                }

                if (my_site) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        return site_list.anyMatch(v => v.id === my_site.id);
                    });
                } else if (site_id) {
                    list = list.filter(val => {
                        const {site_list} = val.data;
                        return site_list.anyMatch(v => v.id === site_id);
                    });
                }
//                console.log(2, evt, list.length)
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
            return "data.name";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="mapResults">
    async function mapResults(item) {
        let {data: {client, project, client_id, project_id, site_list = []}} = item;
        const promise = [];
        if ((client && isObject(client) && !client.data) || client_id) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project) && !project.data) || project_id) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
            }).then(val => {
                item.data.project = val;
            }));
        }

        const sites = await Events.get('plugin_sheq_assist/sites/');
        item.data.site_list = await Promise.all(site_list.map(async site => {
            return sites.find_by_id.call(sites, null, site.id);
        }));

        await Promise.all(promise);
//        console.log('mapResults', JSON.stringify(item.data.site_list))
        return item;
    }
    // </editor-fold>

    const userCntr = new Controller(events, db);

    // <editor-fold defaultstate="collapsed" desc="onLogin">
    async function onLogin() {
        console.log('onLogin contractor permissions')
        const onLogin = functions.httpsCallable('callables-onLogin');
        const res = await onLogin('Contractor');
        console.log('onLogin contractor permissions res', res)
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="auth.onAuthStateChanged">
    auth.onAuthStateChanged((user) => {
        const {selfLogin} = userCntr;
        console.log('contractor selfLogin', selfLogin);

        if (user) {
//            const loginFinal = () => {
//                userCntr.loginImpl(user.uid).then(loggedUser => {
//                    onLogin();
//                    Events.emit(userCntr.root + 'login', loggedUser);
//                });
//            };
//
//            if (selfLogin) {
//                loginFinal();
//            } else {
//                Events.emit(userCntr.root + 'is-valid-user-type', user.uid).then(res => {
//                    if (res) {
//                        loginFinal();
//                    }
//                });
//            }
        } else if (self.session.isLoggedIn()) {
//            self.session.logout();
            //Events.emit(userCntr.root + 'logout', !self.session.isLoggedIn());
        }
    });
    // </editor-fold>
})();