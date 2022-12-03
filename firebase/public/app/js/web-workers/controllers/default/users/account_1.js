
(function () {
    class Controller extends AControllerRead {
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/accounts/");

            this.tbl = 'default_users';

            this.signup = this.signup.bind(this);
            this.login = this.login.bind(this);
            this.logout = this.logout.bind(this);
            this.forgot_pass = this.forgot_pass.bind(this);
            this.change_pass = this.change_pass.bind(this);

            const {addAction, signup, login, logout, forgot_pass, change_pass} = this;
            addAction("signup", signup);
            addAction("login", login);
            addAction("logout", logout);
            addAction("forgot-pass", forgot_pass);
            addAction("change-pass", change_pass);
        }

        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {username} = data;

                let snapshot = await this.getDB().collection(this.tbl).where('username', '==', username).limit(1).get();
                if (!snapshot.empty) {
                    return "EMAIL_DUP";
                }

//                return auth.getUserByEmail(username).catch(async err => {
//                    if (err.message === 'auth/user-not-found') {
                //
                const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;
                data.user_id = user.id;
                data.company_id = company.id;
                data.created_at = this.getDB().FieldValue.serverTimestamp();

                if (my_client) {
                    data.client = {id: my_client.id, name: my_client.name || my_client.data.name};
                    data.client_id = client_id;
                } else if (client_id) {
                    if (!data.client_id) {
                        data.client_id = client_id;
                    }
                }
                if (my_project) {
                    data.project = {id: my_project.id, name: my_project.name || my_project.data.name};
                    data.project_id = project_id;
                } else if (project_id) {
                    if (!data.project_id) {
                        data.project_id = project_id;
                    }
                }
                if (my_site) {
                    data.site = {id: my_site.id, name: my_site.name || my_site.data.name};
                    data.site_id = site_id;
                } else if (site_id) {
                    if (!data.site_id) {
                        data.site_id = site_id;
                    }
                }

                //
                const {user_id, company_id, created_at} = data;

                const {site, project, client, department, job_position, profile_pic} = data;
                if (profile_pic) {
                    delete data.profile_pic;
                }

                let password;
                if (!data.password) {
                    password = uuidv4();
                    password = password.substring(0, password.indexOf('-'));
                    data.password = password;
                } else {
                    password = data.password;
                }

                if (typeof site === 'string') {
                    delete data.site;
                    if (site !== 'All') {
                        const _data = {name: site, user_id, company_id, created_at};
                        const site_doc_ref = await this.getDB().collection('plugin_sheq_assist_sites').add(_data);//Promise < DocumentReference < T > >
                        const site_doc_snapshot = await site_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        data.site = {id: site_doc_snapshot.id, name: site_doc_snapshot.data().name};
                        data.site_id = site_doc_snapshot.id;
                    }
                } else if (site) {
                    data.site_id = site.id;
                }
                if (typeof project === 'string') {
                    delete data.project;
                    if (project !== 'All') {
                        const _data = {name: project, user_id, company_id, created_at};
                        const project_doc_ref = await this.getDB().collection('plugin_sheq_assist_projects').add(_data);//Promise < DocumentReference < T > >
                        const project_doc_snapshot = await project_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        data.project = {id: project_doc_snapshot.id, name: project_doc_snapshot.data().name};
                        data.project_id = project_doc_snapshot.id;
                    }
                } else if (project) {
                    data.project_id = project.id;
                }
                if (typeof client === 'string') {
                    delete data.client;
                    if (client !== 'All') {
                        const _data = {name: client, user_id, company_id, created_at};
                        const client_doc_ref = await this.getDB().collection('plugin_sheq_assist_clients').add(_data);//Promise < DocumentReference < T > >
                        const client_doc_snapshot = await client_doc_ref.get();//Promise < DocumentSnapshot < T > >
                        data.client = {id: client_doc_snapshot.id, name: client_doc_snapshot.data().name};
                        data.client_id = client_doc_snapshot.id;
                    }
                } else if (client) {
                    data.client_id = client.id;
                }
                if (typeof department === 'string') {
                    delete data.department;
                    const _data = {name: department, user_id, company_id, created_at};
                    const department_doc_ref = await this.getDB().collection('plugin_sheq_assist_departments').add(_data);//Promise < DocumentReference < T > >
                    const department_doc_snapshot = await department_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.department = {id: department_doc_snapshot.id, name: department_doc_snapshot.data().name};
                }
                if (typeof job_position === 'string') {
                    delete data.job_position;
                    const _data = {name: job_position, user_id, company_id, created_at};
                    const job_position_doc_ref = await this.getDB().collection('plugin_sheq_assist_job_positions').add(_data);//Promise < DocumentReference < T > >
                    const job_position_doc_snapshot = await job_position_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.job_position = {id: job_position_doc_snapshot.id, name: job_position_doc_snapshot.data().name};
                }

                data.keywords = this.generateKeywords([data.lname, data.fname]);

                this.accountStatus = 'REAUTHENTICATING';

                return await auth.createUserWithEmailAndPassword(data.username, password).then(async userCredential => {//{user}
                    console.log(1, this.tbl, data)
                    const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >;
                    console.log(2)
                    const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;
                    console.log(3)
                    if (data.linked_employee_id) {
                        const employees = await Events.get('plugin_sheq_assist/employees/');
                        const res = await employees.update(evt, data.linked_employee_id, {linked_user_id: doc_snapshot.id});
                    }

                    if (profile_pic) {
                        const gcsUri = await files.upload.call(this, profile_pic, async (bucketFile) => {
                            const new_name = this.tbl + '/' + doc_snapshot.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                            return new_name;
                        }).catch(err => {
                            console.log('users create', err)
                            doc_ref.delete();//Promise < void >
                            userCredential.delete();
                            throw err;
                        });
                        const updated = await doc_ref.update({profile_pic: gcsUri});//Promise < void >
                    }

                    console.log(4)
                    const data = doc_snapshot.data();
                    data.created_at = data.created_at.toDate();

                    const opts = {
                        from: '"SHEQ Assist" <support@sheqsolve.com>',
                        to: username,
                        subject: 'Welcome to SHEQ Assist',
                        html: '<h3><b>Dear ' + data.fname + ' ' + data.lname + '</b></h3>\n\
                                            <p>Your account was recently created on SHEQ Assist.</p>\n\
                                            <p>Your SHEQ Assist Username is <b>' + username + '</b>, Password is <b>' + password + '</b> and User Type is <b>System User</b></p>\n\
                                            <p>You are strongly adviced to change your password as soon as you login in to SHEQ Assist account</p>\n\
                                            <p>Please click <a href="https://sheqsolve.web.app/updater/sheqsolve-1.0.0.exe">here</a> to download the application and use the above username and password to login.</p>\n\
                                            <p>Kind Regards<br/>SHEQ Assist</p>'
                    };

                    console.log('callables-sendEmail', opts)
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log(5)
                    console.log('mailRes', mailRes)

                    return {id: doc_snapshot.id, data};
                }).catch(err => {
                    console.log(err)
                    if (err.code === "auth/email-already-in-use") {
                        return "EMAIL_DUP";
                    } else {
                        throw err;
                    }
                });
//                });
//                    } else {
//                        throw err;
//                    }
//                });
            });
        }

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

                return auth.createUserWithEmailAndPassword(user.username, user.password).then(async userCredential => {//{user}
                    const db_user = await this.getDB().collection(this.tbl).add(user);
                    const snapshot_user = await db_user.get();

                    const company_data = snapshot_company.data();
                    company_data.created_at = company_data.created_at.toDate();
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
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)

                    this.accountStatus = 'CREATED';
                    this.accountStatusNewUser = res;
//                            self.session.loginUser(res);
                    //console.log('signup', res)
                    return true;
                });
//                    } else {
//                        throw err;
//                    }
//                });
            }
        }

        async login(evt, data) {
            const {username, password} = data;
            const res = await auth.signInWithEmailAndPassword(username, password).then(async userCredential => {//{user}
                return true;
            }).catch(err => {
                console.error('login', err)
                if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                    return null;
                } else if (err.code === "auth/too-many-requests") {
                    return err.code;
                } else if (err.code === "auth/network-request-failed") {
                    this.loginImpl(username, password).then(loggedUser => {
                        Events.emit(this.root + 'login', loggedUser);
                    });
//                    throw new Error("AUTH-NETWORK-ERROR");
                } else {
                    throw err;
                }
            });
//            console.log('login', res)
            return res;
        }

        async loginImpl(username, password) {
            let snapshot;
            if (password) {
                snapshot = await this.getDB().collection(this.tbl).where('username', '==', username).where('password', '==', password).limit(1).get();
            } else {
                snapshot = await this.getDB().collection(this.tbl).where('username', '==', username).limit(1).get();
            }
            if (snapshot.empty) {
                return null;
            } else {
                const db_user = snapshot.docs.map(doc => {
                    return {id: doc.id, data: doc.data()};
                })[0];
                //company_name, company_phone, country, zone
                let db_company = await this.getDB().collection('default_companies').doc(db_user.data.company_id).get();

                const company_data = db_company.data();
                company_data.created_at = company_data.created_at.toDate();

                db_company = {id: db_company.id, data: company_data};
                const res = {user: db_user, company: db_company, access_type: 'User'};
                self.session.loginUser(res);

                return res;
            }
        }

        async logout(evt) {
            return Events.whenLoggedIn(loggedUser => {
                return auth.signOut().then(() => true);
            });
        }

        async forgot_pass(evt, data) {
            const {username} = data;

            let snapshot = await this.getDB().collection(this.tbl).where('username', '==', username).limit(1).get();
            if (snapshot.empty) {
                return null;
            } else {
//                return auth.getUserByEmail(username).then(async () => {
                const db_user = snapshot.docs.map(doc => {
                    return {id: doc.id, data: doc.data()};
                })[0];

                const url = `https://sheqsolve.web.app/accounts/pass-recovery.html?id=${db_user.id}`;// -H "Content-Type:application/json" --data '{"name":"Keyboard Cat"}';
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
                console.log('mailRes', mailRes);

                return true;
//                });
            }
        }

        async change_pass(evt, password) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user} = loggedUser;
                return auth.getUserByEmail(user.data.username).then(async () => {
                    const doc_ref = await this.getDB().collection(this.tbl).doc(user.id);
                    let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                    if (!doc_snapshot.exists) {
                        return null;
                    }

                    const updated = await doc_ref.update({password});//Promise < void >

                    user.data.password = password;

                    return password;
                });
            });
        }
    }

    const userCntr = new Controller(events, db);

    auth.onAuthStateChanged((userCredential) => {
        console.log('userCredential', userCredential);
        const {accountStatus, accountStatusNewUser} = userCntr;
        if (accountStatus === 'REAUTHENTICATED') {
            delete userCntr.accountStatus;
            return;
        }

        if (userCredential) {
            if (accountStatus === 'REAUTHENTICATING') {
                Events.whenLoggedIn(async loggedUser => {
                    userCntr.accountStatus = 'REAUTHENTICATED';
                    const {username, password} = loggedUser.user.data;
                    auth.signInWithEmailAndPassword(username, password).then(async userCredential => {//{user}

                    });
                });
            } else if (accountStatus === 'CREATING') {
                execWhen(() => accountStatus === 'CREATED').then(() => {
                    Events.emit(userCntr.root + 'login', accountStatusNewUser);
                    delete userCntr.accountStatus;
                    delete userCntr.accountStatusNewUser;
                });
            } else {
                const {email} = userCredential;
                userCntr.loginImpl(email).then(loggedUser => {
                    Events.emit(userCntr.root + 'login', loggedUser);
                });
            }
        } else if (self.session.isLoggedIn()) {
            self.session.logout();
            Events.emit(userCntr.root + 'logout', !self.session.isLoggedIn());
        }
    });
})();