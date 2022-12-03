
(function () {
    class Controller extends AControllerRead {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "admin/users/accounts/");

            this.tbl = 'admin_users';

            const {addAction} = this;
            addAction("login", this.login.bind(this));
            addAction("login-auto", this.loginAuto.bind(this));
            addAction("login/username", this.loginUsername.bind(this));
            addAction("find_by/username", this.getByUsername.bind(this));
            addAction("login/biometric", this.loginBiometric.bind(this));
            addAction("setup/biometric", this.setupBiometric.bind(this));
            addAction("logout", this.logout.bind(this));
            addAction("forgot-pass", this.forgot_pass.bind(this));
            addAction("change-pass", this.change_pass.bind(this));
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
                const {username} = DATA;

                // <editor-fold defaultstate="collapsed" desc="data collection">
                let snapshot = await this.getDB().collection(this.tbl).where('username', '==', username).limit(1).get();
                if (!snapshot.empty) {
                    return "EMAIL_DUP";
                }

//                return auth.getUserByEmail(username).catch(async err => {
//                    if (err.message === 'auth/user-not-found') {
                //
                const {user, company} = loggedUser;
                DATA.user_id = user.id;
                DATA.company_id = company.id;
                DATA.created_at = FBSettings.FieldValue.serverTimestamp();

                //
                const {user_id, company_id, created_at} = DATA;

                const {department, job_position, profile_pic} = DATA;
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
                    console.log('users create userCredential', uid, DATA)

                    await this.getDB().collection(this.tbl).doc(uid).set(DATA);//Promise < DocumentReference < T > >;
                    const doc_ref = await this.getDB().collection(this.tbl).doc(uid);//Promise < DocumentReference < T > >;
                    const doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >;

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

                    const opts = {
                        from: '"SHEQ Aid" <support@sheqsolve.com>',
                        to: username,
                        subject: 'Welcome to SHEQ Aid',
                        html: '<h3><b>Dear ' + DATA.fname + ' ' + DATA.lname + '</b></h3>\n\
                                            <p>Your account was recently created on SHEQ Aid.</p>\n\
                                            <p>Your SHEQ Aid Username is <b>' + username + '</b>, Password is <b>' + password + '</b> and User Type is <b>System User</b></p>\n\
                                            ' + Utils.getAppDownloadOptionMsg()
                    };

                    console.log('callables-sendEmail', opts)
                    const sendEmail = functions.httpsCallable('callables-sendEmail');
                    const mailRes = await sendEmail(opts);
                    console.log('mailRes', mailRes)

                    return AdminUserFuns.mapResults({id: doc_snapshot.id, data: DATA});
                };

                try {
                    return await authGeneral.
                            createUserWithEmailAndPassword(username, password).
                            then(userCredential => userCredential.user.uid).
                            then(save);
                } catch (err) {
                    if (err.code === "auth/email-already-in-use") {
                        const getUserUidByUsername = functions.httpsCallable('callables-getUserUidByUsername');
                        const res = await getUserUidByUsername(username);
                        if (res && res.data) {
                            const {data: uid} = res;
                            return save(uid, false);
                        }
//                        return await authGeneral.signInWithEmailAndPassword(username, password).then(save);
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
            let {username, password} = data;
            username = username.toLowerCase();

            const fnName = username.isEmailAddress() ? 'signInWithEmailAndPassword' : 'signInWithPhoneNumberAndPassword';
            const res = await auth[fnName](username, password).then(async userCredential => {
                if (!userCredential)
                    return false;
                const {user} = userCredential;
                await onLogin();
                return this.loginImpl(user.uid);
            }).catch(err => {
                console.error('login', err)
                if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                    return null;
                } else if (err.code === "auth/too-many-requests") {
                    return err.code;
                } else if (err.code === "auth/network-request-failed") {
                    return err.code;
                } else {
                    throw err;
                }
            });
            return res;
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="login-auto">
        async loginAuto(evt) {
            const {currentUser} = auth;
            if (!currentUser)
                return null;
            await onLogin();
            return this.loginImpl(currentUser.uid);
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="loginImpl">
        async loginImpl(uid) {
            let doc_ref = await this.getDB().collection(this.tbl).doc(uid);
            const snapshot = await doc_ref.get();
//            console.log('loginImpl', snapshot.exists)
            if (!snapshot.exists) {
                return null;
            } else {
                let db_user = {id: snapshot.id, data: snapshot.data()};
                //company_name, company_phone, country, zone
                let db_company = await this.getDB().collection('admin_company').doc(db_user.data.company_id).get();

                const company_data = db_company.data();
                company_data.name = company_data.company_name;
                company_data.created_at = company_data.created_at.toDate();

                db_company = {id: db_company.id, data: company_data};
                const res = {user: db_user, company: db_company, access_type: 'User'};

                self.session.loginUser(res);

                res.user = await AdminUserFuns.mapResults(db_user);

                return res;
            }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="loginUsername">
        async loginUsername(evt, username) {
            console.log('loginUsername user')
            const item = await this.getByUsername(evt, username);
            if (!item || isString(item)) {
                return item;
            }
            const {id, data} = item;

            const getUserUidByUsername = functions.httpsCallable('callables-getUserUidByUsername');
            const res = await getUserUidByUsername(username);
            if (!res || !res.data) {
                return {id};
            }
            const {data: uid} = res;
            return {uid, id};
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="getByUsername">
        async getByUsername(evt, username) {
            console.log('getByUsername user')
            username = username.toLowerCase();

            const key = username.isEmailAddress() ? 'username' : 'phone';
            const snapshot = await this.getDB().collection(this.tbl).where(key, '==', username).limit(1).get();
            if (!snapshot || snapshot.empty) {
                return "NO_USER_DB";
            }
            const doc = snapshot.docs[0];
            return {id: doc.id, data: doc.data()};
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="loginBiometric">
        async loginBiometric(evt, {username, match, displaySize}) {
            console.log('loginBiometric user')
            username = username.toLowerCase();

            const onLoginBiometric = functions.httpsCallable('callables-onLoginBiometric');
            const res = await onLoginBiometric({type: 'User', username, match, displaySize});
            if (!res || !res.data) {
                return null;
            }
            const {data} = res;
            if (isString(data)) {
                return data;
            } else {
                const {token: customToken} = data;
                console.log('loginBiometric user customToken')
                const res = await auth.signInWithCustomToken(customToken).then(async userCredential => {
                    if (!userCredential)
                        return null;
                    const {user} = userCredential;
                    await onLogin();
                    return this.loginImpl(user.uid);
                });
                return res;
        }
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="setupBiometric">
        async setupBiometric(evt, {uid, imgSrc}) {
            console.log('setupBiometric user')
            const onSetupBiometric = functions.httpsCallable('callables-onSetupBiometric');
            const res = await onSetupBiometric({type: 'User', uid, imgSrc});
            if (!res || !res.data) {
                return null;
            }
            const {data} = res;
            if (isString(data)) {
                return data;
            } else {
                const {token: customToken} = data;
                console.log('setupBiometric user res')
                const res = await auth.signInWithCustomToken(customToken).then(async userCredential => {
                    if (!userCredential)
                        return null;
                    const {user} = userCredential;
                    await onLogin();
                    return this.loginImpl(user.uid);
                });
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
            let {username} = data;
            if(!username) return null;
            const sendForgotPass = functions2.httpsCallable('callables-sendForgotPassAdmin');
            const res = await sendForgotPass(username);
            console.log('forgot_pass res', res)
            if (!res || !res.data) {
                return null;
            }

            return res.data;
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

                return password;
            });
        }
        // </editor-fold>
        
        // <editor-fold defaultstate="collapsed" desc="update_phone">
        async update_phone(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                if (!data)
                    return null;
                const updatePhone = functions2.httpsCallable('callables-updatePhone');
                const res = await updatePhone({...data, type: 'Admin'});
                console.log('update_phone res', res)
                if (!res || !res.data) {
                    return null;
                }

                return res.data;
            });
        }
        // </editor-fold>

    }

    const userCntr = new Controller(events, db);

    // <editor-fold defaultstate="collapsed" desc="onLogin">
    async function onLogin() {
        const onLogin = functions.httpsCallable('callables-onLogin');
        try {
            const res = await onLogin('User');
        } catch (ex) {
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="auth.onAuthStateChanged">
    auth.onAuthStateChanged((user) => {
        const {accountStatus, accountStatusNewUser} = userCntr;
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
            }
        } else if (self.session.isLoggedIn()) {
        }
    });
    // </editor-fold>

})();