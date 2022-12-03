
(function () {
    class Controller extends AControllerRead {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/accounts/");

            this.tbl = 'default_users';

            const {addAction} = this;
            addAction("signup", this.signup.bind(this));
            addAction("login", this.login.bind(this));
            addAction("login-auto", this.loginAuto.bind(this));
            addAction("logout", this.logout.bind(this));
            addAction("forgot-pass", this.forgot_pass.bind(this));
            addAction("change-pass", this.change_pass.bind(this));
        }

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, DATA) {
            return Events.whenLoggedIn(async loggedUser => {
                const {username} = DATA;

                // <editor-fold defaultstate="collapsed" desc="data collection">
                let snapshot = await this.getDB().collection(this.tbl).where('username', '==', username).limit(1).get();
                if (!snapshot.empty) {
                    return "EMAIL_DUP";
                }

//                return auth.getUserByEmail(username).catch(async err => {
//                    if (err.message === 'auth/user-not-found') {
                //
                const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;
                DATA.user_id = user.id;
                DATA.company_id = company.id;
                DATA.created_at = this.getDB().FieldValue.serverTimestamp();

                if (my_client) {
                    DATA.client = {id: my_client.id, name: my_client.name || my_client.data.name};
                    DATA.client_id = client_id;
                } else if (client_id) {
                    if (!DATA.client_id) {
                        DATA.client_id = client_id;
                    }
                }
                if (my_project) {
                    DATA.project = {id: my_project.id, name: my_project.name || my_project.data.name};
                    DATA.project_id = project_id;
                } else if (project_id) {
                    if (!DATA.project_id) {
                        DATA.project_id = project_id;
                    }
                }
                if (my_site) {
                    DATA.site = {id: my_site.id, name: my_site.name || my_site.data.name};
                    DATA.site_id = site_id;
                } else if (site_id) {
                    if (!DATA.site_id) {
                        DATA.site_id = site_id;
                    }
                }

                //
                const {user_id, company_id, created_at} = DATA;

                const {site, project, client, department, job_position, profile_pic} = DATA;
                if (profile_pic) {
                    delete DATA.profile_pic;
                }

                let password;
                if (!DATA.password) {
                    password = uuidv4();
                    password = password.substring(0, password.indexOf('-'));
                    DATA.password = password;
                } else {
                    password = DATA.password;
                }

                if (typeof site === 'string') {
                    delete DATA.site;
                    if (site !== 'All') {
                        const _data = {name: site, user_id, company_id, created_at};
                        const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                        const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        DATA.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                        DATA.site_id = site_doc_snapshot.id;
                    }
                } else if (site) {
                    DATA.site_id = site.id;
                }
                if (typeof project === 'string') {
                    delete DATA.project;
                    if (project !== 'All') {
                        const _data = {name: project, user_id, company_id, created_at};
                        const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                        const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        DATA.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                        DATA.project_id = project_doc_snapshot.id;
                    }
                } else if (project) {
                    DATA.project_id = project.id;
                }
                if (typeof client === 'string') {
                    delete DATA.client;
                    if (client !== 'All') {
                        const _data = {name: client, user_id, company_id, created_at};
                        const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                        const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        DATA.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                        DATA.client_id = client_doc_snapshot.id;
                    }
                } else if (client) {
                    DATA.client_id = client.id;
                }
                if (typeof department === 'string') {
                    delete DATA.department;
                    const _data = {name: department, user_id, company_id, created_at};
                    const department_doc_ref = await this.getDB().collection('plugin_sheq_assist_departments').add(_data);//Promise < DocumentReference < T > >
                    const department_doc_snapshot = await department_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    DATA.department = {id: department_doc_snapshot.id, name: department_doc_snapshot.data().name};
                }
                if (typeof job_position === 'string') {
                    delete DATA.job_position;
                    const _data = {name: job_position, user_id, company_id, created_at};
                    const job_position_doc_ref = await this.getDB().collection('plugin_sheq_assist_job_positions').add(_data);//Promise < DocumentReference < T > >
                    const job_position_doc_snapshot = await job_position_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    DATA.job_position = {id: job_position_doc_snapshot.id, name: job_position_doc_snapshot.data().name};
                }

                DATA.keywords = this.generateKeywords([DATA.lname, DATA.fname]);
                // </editor-fold>

                try {
                    const userCredential = await authGeneral.createUserWithEmailAndPassword(username, password);
                    await authGeneral.signOut();

                    const {uid} = userCredential.user;

                    console.log('users create userCredential', uid, DATA)

                    await this.getDB().collection(this.tbl).doc(uid).set(DATA);//Promise < DocumentReference < T > >;
                    const doc_ref = await this.getDB().collection(this.tbl).doc(uid);//Promise < DocumentReference < T > >;
                    const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;
                    if (DATA.linked_employee_id) {
                        const employees = await Events.get('plugin_sheq_assist/employees/');
                        const res = await employees.update(evt, DATA.linked_employee_id, {linked_user_id: doc_snapshot.id});
                    }

                    if (profile_pic) {
                        try {
                            const gcsUri = await files.upload.call(this, profile_pic, async (bucketFile) => {
                                const new_name = this.tbl + '/' + doc_snapshot.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                                return new_name;
                            });
                            const updated = await doc_ref.update({profile_pic: gcsUri});//Promise < void >
                        } catch (err) {
                            console.log('users create', err)
                            doc_ref.delete();//Promise < void >
                            userCredential.delete();
                            throw err;
                        }
                    }

                    DATA = doc_snapshot.data();
                    DATA.created_at = DATA.created_at.toDate();

                    const opts = {
                        from: '"SHEQ Assist" <support@sheqsolve.com>',
                        to: username,
                        subject: 'Welcome to SHEQ Assist',
                        html: '<h3><b>Dear ' + DATA.fname + ' ' + DATA.lname + '</b></h3>\n\
                                            <p>Your account was recently created on SHEQ Assist.</p>\n\
                                            <p>Your SHEQ Assist Username is <b>' + username + '</b>, Password is <b>' + password + '</b> and User Type is <b>System User</b></p>\n\
                                            <p>You are strongly adviced to change your password as soon as you login in to SHEQ Assist account</p>\n\
                                            <p>Please click <a href="https://sheqsolve.web.app/updater/sheqsolve-1.0.0.exe">here</a> to download the application and use the above username and password to login.</p>\n\
                                            <p>Kind Regards<br/>SHEQ Assist</p>'
                    };

                    console.log('callables-sendEmail', opts)
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)

                    return {id: doc_snapshot.id, data: DATA};
                } catch (err) {
                    console.log(err)
                    if (err.code === "auth/email-already-in-use") {
                        return "EMAIL_DUP";
                    } else {
                        throw err;
                    }
                }
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="signup">
        async signup(evt, data) {
            //console.log('signup data', data)
            const {user, user: {username}, company} = data;
            let snapshot = await this.getDB().collection(this.tbl).where('username', '==', username).limit(1).get();
            if (!snapshot.empty) {
                return "EMAIL_DUP";
            } else {
//                return auth.getUserByEmail(username).catch(async err => {
//                    if (err.message === 'auth/user-not-found') {
                //company_name, company_phone, country, zone
                company.created_at = this.getDB().FieldValue.serverTimestamp();
                const db_company = await this.getDB().collection('default_companies').add(company);
                const snapshot_company = await db_company.get();
                //console.log('signup db_company', snapshot_company)
                user.company_id = snapshot_company.id;
                user.user_type = "Administrator";

                user.keywords = this.generateKeywords([data.lname, data.fname]);

                this.accountStatus = 'CREATING';

                try {
                    let userCredential = await authGeneral.createUserWithEmailAndPassword(user.username, user.password);
                    await authGeneral.signOut();

                    const {uid} = userCredential.user;

                    await this.getDB().collection(this.tbl).doc(uid).set(user);//Promise < DocumentReference < T > >;
                    const doc_ref = await this.getDB().collection(this.tbl).doc(uid);//Promise < DocumentReference < T > >;
                    const snapshot_user = await doc_ref.get();//Promise < DocumentSnapshot < T > >;

                    const company_data = snapshot_company.data();
                    company_data.created_at = company_data.created_at.toDate();
                    if (company_data.trial_start_date) {
                        company_data.trial_start_date = company_data.trial_start_date.toDate();
                    }
                    const res = {
                        user: {id: snapshot_user.id, data: snapshot_user.data()},
                        company: {id: snapshot_company.id, data: company_data},
                        access_type: 'User'
                    };
                    const opts = {
                        from: '"SHEQ Assist" <support@sheqsolve.com>',
                        to: username,
                        subject: 'Welcome to SHEQ Assist',
                        html: '<h3><b>Dear ' + res.user.data.fname + ' ' + res.user.data.lname + '</b></h3>\n\
                    <p>Your account was recently created on SHEQ Assist.</p>\n\
                    <p>Your SHEQ Assist Username is <b>' + username + '</b> and User Type is <b>Administrator</b></p>\n\
                    <p>Kind Regards<br/>SHEQ Assist</p>'
                    };
                    console.log('callables-sendEmail', opts)
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)

                    this.accountStatusNewUser = res;

                    userCredential = await auth.signInWithEmailAndPassword(user.username, user.password);
//                            self.session.loginUser(res);
                    //console.log('signup', res)
                    this.accountStatus = 'CREATED';

                    return true;
                } catch (err) {
                    console.log(err)
                    if (err.code === "auth/email-already-in-use") {
                        return "EMAIL_DUP";
                    } else {
                        throw err;
                    }
                }
            }
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

        // <editor-fold defaultstate="collapsed" desc="login-auto">
        async loginAuto(evt) {
//            this.selfLogin = false;
            const {currentUser} = firebase.auth();
            if(!currentUser) return null;
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
                const res = {user: db_user, company: db_company, access_type: 'User'};
                self.session.loginUser(res);
                
                res.user = await mapUser(db_user);

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
                const res = {user: db_user, company: db_company, access_type: 'User'};
                
                self.session.loginUser(res);
                
                res.user = await mapUser(db_user);

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

        // <editor-fold defaultstate="collapsed" desc="forgot_pass">
        async forgot_pass(evt, data) {
            const {username} = data;

            const col_ref = await this.getDB().collection(this.tbl).where('username', '==', username).limit(1);
            const col_snapshot = await col_ref.get();
            if (col_snapshot.empty) {
                return null;
            } else {
                const reset_password_id = uuidv4();
                let snapshot = col_snapshot.docs[0];
                const doc_ref = await this.getDB().collection(this.tbl).doc(snapshot.id);
                snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }
                
                await doc_ref.update({reset_password_id});

                const url = `https://sheqsolve.web.app/accounts/pass-recovery.html?id=${reset_password_id}`;// -H "Content-Type:application/json" --data '{"name":"Keyboard Cat"}';
                const opts = {
                    from: '"SHEQ Assist" <support@sheqsolve.com>',
                    to: username,
                    subject: 'SHEQ Assist - Recover Password',
                    html: '<h3><b>Recover Password</b></h3>\n\
                    <hr />\n\
                    <p>Need to reset your password? No problem. Just click the button below and you will be on your way.</p>\n\
                    <p><b>Note: You MUST have opened the software before clicking the button below.</b></p>\n\
                    <p>If you did not make this request, please ignore this email.</p><br />\n\
                    <p><a href="' + url + '" style="font-size: 20px; color: #ddd; text-decoration: none; padding: 15px; border-radius: 3px; box-shadow: 0 0 3px #eee; background: rgb(2, 168, 168);">Reset Your Password</a></p>'
                };

                const sendEmail = functions.httpsCallable('callables-sendEmail');
                const mailRes = await sendEmail(opts);
                console.log('mailRes', mailRes)

                return true;
//                });
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="change_pass">
        async change_pass(evt, password) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user} = loggedUser;

                const doc_ref = await this.getDB().collection(this.tbl).doc(user.id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                const updated = await doc_ref.update({password});//Promise < void >
                await auth.currentUser.updatePassword(password);

                user.data.password = password;

                return password;
            });
        }
        // </editor-fold>
    }

    const userCntr = new Controller(events, db);

    // <editor-fold defaultstate="collapsed" desc="onLogin">
    async function onLogin() {
        console.log('onLogin user permissions')
        const onLogin = functions.httpsCallable('callables-onLogin');
        const res = await onLogin('User');
        console.log('onLogin user permissions res', res)
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="auth.onAuthStateChanged">
    auth.onAuthStateChanged((user) => {
        const {selfLogin, accountStatus, accountStatusNewUser} = userCntr;
        console.log('user selfLogin', selfLogin);

//        console.log('user', user);
//        console.log('accountStatus', accountStatus);
//        console.log('accountStatusNewUser', accountStatusNewUser);

        if (user) {
            if (accountStatus === 'CREATING') {
                execWhen(() => userCntr.accountStatus === 'CREATED').then(() => {
                    onLogin();
                    Events.emit(userCntr.root + 'create', accountStatusNewUser);
                    delete userCntr.accountStatus;
                    delete userCntr.accountStatusNewUser;
                });
            } else {
//                const loginFinal = () => {
//                    userCntr.loginImpl(user.uid).then(loggedUser => {
//                        onLogin();
//                        Events.emit(userCntr.root + 'login', loggedUser);
//                    });
//                };
//
//                if (selfLogin) {
//                    loginFinal();
//                } else {
//                    Events.emit(userCntr.root + 'is-valid-user-type', user.uid).then(res => {
//                        if (res) {
//                            loginFinal();
//                        }
//                    });
//                }
            }
        } else if (self.session.isLoggedIn()) {
//            self.session.logout();
//            Events.emit(userCntr.root + 'logout', !self.session.isLoggedIn());
        }
    });
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="mapUser">
    async function mapUser(item) {
        let {data: {client, project, site}} = item;
        const promise = [];
        if ((client && isObject(client))) {
            promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
                return clients.find_by_id.call(clients, null, client.id);
            }).then(val => {
                item.data.client = val;
            }));
        }
        if ((project && isObject(project))) {
            promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
                return projects.find_by_id.call(projects, null, project.id);
            }).then(val => {
                item.data.project = val;
            }));
        }
        if ((site && isObject(site))) {
            promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
                return sites.find_by_id.call(sites, null, site.id);
            }).then(val => {
                item.data.site = val;
            }));
        }
        await Promise.all(promise);
        return item;
    }
    // </editor-fold>

})();