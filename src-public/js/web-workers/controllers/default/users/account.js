
(function () {
    class Controller extends AAccountsCntr {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/accounts/");

            this.tbl = 'default_users';

            const {addAction} = this;
            addAction("signup", this.signup.bind(this));
        }
        // </editor-fold>

        get isUser() {
            return true;
        }
        
        get access_type() {
            return 'User';
        }

        get auth() {
            return auth;
        }
        
        get functions() {
            return functions;
        }
        
        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, DATA) {
            return Events.whenLoggedIn(async loggedUser => {
                if (DATA.username) {
                    DATA.username = DATA.username.toLowerCase();
                }
                const {username} = DATA;

                const colRef = this.getDB().collection(this.tbl);
                // <editor-fold defaultstate="collapsed" desc="data collection">
                let snapshot = await colRef.where('username', '==', username).limit(1).get();
                if (!snapshot.empty) {
                    return "EMAIL_DUP";
                }

//                return auth.getUserByEmail(username).catch(async err => {
//                    if (err.message === 'auth/user-not-found') {
                //
                const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;
                DATA.user_id = user.id;
                DATA.company_id = company.id;
                DATA.created_at = FBSettings.FieldValue.serverTimestamp();

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
                    if (site !== 'All') {
                        const _data = {name: site, user_id, company_id, created_at};
                        const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                        const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        DATA.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                        DATA.site_id = site_doc_snapshot.id;
                    } else {
                        DATA.site = null;
                        DATA.site_id = null;
                    }
                } else if (site) {
                    DATA.site_id = site.id;
                }
                if (typeof project === 'string') {
                    if (project !== 'All') {
                        const _data = {name: project, user_id, company_id, created_at};
                        const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                        const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        DATA.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                        DATA.project_id = project_doc_snapshot.id;
                    } else {
                        DATA.project = null;
                        DATA.project_id = null;
                    }
                } else if (project) {
                    DATA.project_id = project.id;
                }
                if (typeof client === 'string') {
                    if (client !== 'All') {
                        const _data = {name: client, user_id, company_id, created_at};
                        const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                        const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        DATA.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                        DATA.client_id = client_doc_snapshot.id;
                    } else {
                        DATA.client = null;
                        DATA.client_id = null;
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

                const save = async (uid, isNew = true) => {
                    if (isNew) {
                        DATA.password = password;
                        await authGeneral.signOut();
                    }
                    console.log('users create userCredential', uid, DATA)

                    await colRef.doc(uid).set(DATA);//Promise < DocumentReference < T > >;
                    const doc_ref = await colRef.doc(uid);//Promise < DocumentReference < T > >;
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
//                            doc_ref.delete();//Promise < void >
//                            userCredential.delete();
//                            throw err;
                        }
                    }

                    DATA = doc_snapshot.data();
                    DATA.created_at = DATA.created_at.toDate();

                    await AllUserFuns.sendCreationEmail('UserCreate',
                            {username, password, fname: DATA.fname, lname: DATA.lname});

                    return UserFuns.mapResults({id: doc_snapshot.id, data: DATA});
                };

                return AllUserFuns.createOrGetUserID(authGeneral, username, password, save);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="signup">
        async signup(evt, data) {
            //console.log('signup data', data)
            if (data.user.username) {
                data.user.username = data.user.username.toLowerCase();
            }
            const {user, user: {uid, token: customToken, username, password}, company} = data;
            delete data.user.uid;
            delete data.user.token;

            const colRef = this.getDB().collection(this.tbl);
            let snapshot = await colRef.where('username', '==', username).limit(1).get();
            if (!snapshot.empty) {
                return "EMAIL_DUP";
            }

//                return auth.getUserByEmail(username).catch(async err => {
//                    if (err.message === 'auth/user-not-found') {
            //company_name, company_phone, country, zone
            company.created_at = FBSettings.FieldValue.serverTimestamp();
            company.keywords = this.generateKeywords([company.company_name]);

            const db_company = await this.getDB().collection('default_companies').add(company);
            const snapshot_company = await db_company.get();
            //console.log('signup db_company', snapshot_company)
            user.company_id = snapshot_company.id;
            user.client_id = null;
            user.project_id = null;
            user.site_id = null;
            user.client = null;
            user.project = null;
            user.site = null;
            user.user_type = "Administrator";
            user.auth_type = "MultiFactor";

            user.keywords = this.generateKeywords([user.lname, user.fname]);

            this.accountStatus = 'CREATING';

            const save = async (uid, isNew = true) => {
                if (isNew) {
                    await authGeneral.signOut();
                }
                await colRef.doc(uid).set(user);//Promise < DocumentReference < T > >;
                const doc_ref = await colRef.doc(uid);//Promise < DocumentReference < T > >;
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

                await AllUserFuns.sendCreationEmail('UserSignup',
                        {username, fname: res.user.data.fname, lname: res.user.data.lname});

                delete res.user.data.password;

                this.accountStatusNewUser = res;

                let userCredential;
                if (customToken) {
                    userCredential = await this.auth.signInWithCustomToken(customToken);
                } else {
                    userCredential = await this.auth.signInWithEmailAndPassword(user.username, user.password);
                }

                self.session.loginUser(res);
                //console.log('signup', res)
                this.accountStatus = 'CREATED';

                return true;
            };

            if (uid) {
                return save(uid);
            }
            return AllUserFuns.createOrGetUserID(authGeneral, user.username, user.password, save);
        }
        // </editor-fold>

    }

    const userCntr = new Controller(events, db);

    // <editor-fold defaultstate="collapsed" desc="auth.onAuthStateChanged">
    auth.onAuthStateChanged((user) => {
        const {accountStatus, accountStatusNewUser} = userCntr;
//        console.log('user', user);
//        console.log('accountStatus', accountStatus);
//        console.log('accountStatusNewUser', accountStatusNewUser);

        if (user) {
            if (accountStatus === 'CREATING') {
                execWhen(() => userCntr.accountStatus === 'CREATED').then(() => {
                    userCntr.onLogin();
                    Events.emit(userCntr.root + 'create', accountStatusNewUser);
                    delete userCntr.accountStatus;
                    delete userCntr.accountStatusNewUser;
                });
            } else {
            }
        } else if (self.session.isLoggedIn()) {
        }
    });
    // </editor-fold>

})();//585