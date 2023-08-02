class AAccountsCntr2 extends AControllerRead {
    //<editor-fold desc="constructor">
    constructor(events, db, name, root, tbl, fn) {
        super(events, db, name, root, tbl, fn);

        const {addAction} = this;

        addAction("login", this.login.bind(this));
        addAction("login-auto", this.loginAuto.bind(this));

        addAction("login/biometric", this.loginBiometric.bind(this));
        addAction("setup/biometric", this.setupBiometric.bind(this));

        addAction("login/username", this.loginUsername.bind(this));
        addAction("find_by/username", this.getByUsername.bind(this));

        addAction("logout", this.logout.bind(this));

        addAction("forgot-pass", this.forgot_pass.bind(this));
        addAction("change-pass", this.change_pass.bind(this));
        addAction("update-phone", this.update_phone.bind(this));

        //this is for all users in firebase
        addAction("check/auth/username", this.getUserUID.bind(this));
        addAction("email/otp", this.emailOTP.bind(this));
        addAction("confirm/otp", this.confirmOTP.bind(this));
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSetCustomUserClaims">
    async onSetCustomUserClaims(userOrToken) {
        const process = async (idToken) => {
            // Session login endpoint is queried and the session cookie is set.
            // CSRF protection should be taken into account.
            // ...

            const path = `accounts/onSetCustomUserClaims/${this.access_type}`;

            const csrfToken = await Utils.cookie('csrfToken');
            console.log("csrfToken", csrfToken)
            const res = await Utils.apiCallable(path, {
                idToken, csrfToken
            });

            if (!res) {
                return null;
            }
            console.log('onSetCustomUserClaims', res)
            return res;
        };

        if(isString(userOrToken)) {
            return process(userOrToken);
        }
        return userOrToken.getIdToken(true).then(process);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="login">
    async login(evt, data) {
        let {username, password} = data;
        username = username.toLowerCase();

        const fnName = username.isEmailAddress() ? 'signInWithEmailAndPassword' : 'signInWithPhoneNumberAndPassword';
        const res = await this.auth[fnName](username, password).then(async userCredential => {
            if (!userCredential)
                return false;
            const {user} = userCredential;

            const res = await this.onSetCustomUserClaims(user);
            return this.loginImpl(res);
            // if (this.isStaff) {
            //     return this.loginImpl(user.email);
            // } else {
            //     return this.loginImpl(user.uid);
            // }
        }).catch(err => {
            console.error('login', err)
            if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                return null;
            } else if (err.code === "auth/too-many-requests" || err.code === "auth/network-request-failed") {
                return err.code;
            } else {
                throw err;
            }
        });
        return res;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="login-auto">
    async loginAuto(evt, token) {
        let res = await this.onSetCustomUserClaims(token);
        console.log('loginAuto loggedUser', res)
        return await this.loginImpl(res);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="loginBiometric">
    async loginBiometric(evt, {username, match, displaySize}) {
        console.log('loginBiometric')
        username = username.toLowerCase();

        const onLoginBiometric = this.functions.httpsCallable('callables-onLoginBiometric');
        const res = await onLoginBiometric({username, match, displaySize});
        if (!res || !res.data) {
            return null;
        }
        const {data} = res;
        if (isString(data)) {
            return data;
        } else {
            const {token: customToken} = data;
            console.log('loginBiometric customToken')
            const res = await this.auth.signInWithCustomToken(customToken).then(async userCredential => {
                if (!userCredential)
                    return null;
                const {user} = userCredential;
                let res = await this.onSetCustomUserClaims(user);
                return this.loginImpl(res);
                // if (this.isStaff) {
                //     return this.loginImpl(user.email);
                // } else {
                //     return this.loginImpl(user.uid);
                // }
            });
            return res;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setupBiometric">
    async setupBiometric(evt, {uid, imgSrc}) {
        console.log('setupBiometric')
        const onSetupBiometric = this.functions.httpsCallable('callables-onSetupBiometric');
        const res = await onSetupBiometric({uid, imgSrc});
        if (!res || !res.data) {
            return null;
        }
        const {data} = res;
        if (isString(data)) {
            return data;
        } else {
            const {token: customToken} = data;
            console.log('setupBiometric res')
            const res = await this.auth.signInWithCustomToken(customToken).then(async userCredential => {
                if (!userCredential)
                    return null;
                const {user} = userCredential;
                let res = await this.onSetCustomUserClaims(user);
                return this.loginImpl(res);
                // if (this.isStaff) {
                //     return this.loginImpl(user.email);
                // } else {
                //     return this.loginImpl(user.uid);
                // }
            });
            return res;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="loginImpl">
    async loginImpl(res) {
        if (res) {
            let {loggedUser, token} = res;
            loggedUser = {...loggedUser, access_type: this.access_type};

            self.session.loginUser(loggedUser);
            return {loggedUser, token};
        }

        // let snapshot;
        // if (this.isStaff) {
        //     const username = uid.toLowerCase();
        //
        //     const key = username.isEmailAddress() ? 'email' : 'phone';
        //     snapshot = await this.getDB().collection(this.tbl).where(key, '==', username).limit(1).get();
        //     if (snapshot.empty) {
        //         return null;
        //     } else {
        //         snapshot = snapshot.docs[0];
        //     }
        // } else {
        //     let doc_ref = await this.getDB().collection(this.tbl).doc(uid);
        //     snapshot = await doc_ref.get();
        //     if (!snapshot.exists) {
        //         return null;
        //     }
        // }
        //
        // if (snapshot) {
        //     let tries = 0;
        //     const res = await execWhen(async () => {
        //         try {
        //             let db_user = {id: snapshot.id, data: snapshot.data()};
        //             let db_company = await db.collection('default_companies').doc(db_user.data.company_id).get();
        //
        //             const company_data = db_company.data();
        //             company_data.name = company_data.company_name;
        //             company_data.created_at = company_data.created_at.toDate();
        //             if (company_data.trial_start_date) {
        //                 company_data.trial_start_date = company_data.trial_start_date.toDate();
        //             }
        //             db_company = {id: db_company.id, data: company_data};
        //             return {user: db_user, company: db_company, access_type: this.access_type};
        //         } catch (e) {
        //             if(tries === 5) {
        //                 return {err: e};
        //             }
        //             tries++;
        //             console.error('loginImpl must retry', e)
        //             return undefined;
        //         }
        //     });
        //
        //     if(res.err) {
        //         throw res.err;
        //     }
        //
        //     self.session.loginUser(res);
        //
        //     const {user, company} = res;
        //
        //     if (this.isStaff) {
        //         const actions = [
        //             {
        //                 path: 'plugin_sheq_assist/employees/teams/',
        //                 fn: 'find_by_supervisor_by_id',
        //                 key: 'current_team',
        //                 args: [user.id]
        //             }
        //         ];
        //         res.user = await EmployeeFuns.mapResults.call(this, user, actions);
        //         const {current_team} = user.data;
        //         if (current_team) {
        //             res.logged_supervisor_id = user.id;
        //         }
        //     } else if (this.isContractorUser) {
        //         res.user = await ContractorUserFuns.mapResults(user);
        //     } else {
        //         res.user = await UserFuns.mapResults(user);
        //     }
        //
        //     return res;
        // }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="logout">
    async logout(evt) {
        return Events.whenLoggedIn(loggedUser => {
            self.session.logout();
            return this.auth.signOut().then(() => true);
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="forgot_pass">
    async forgot_pass(evt, data) {
        let {username} = data;
        if (!username)
            return null;
        const sendForgotPass = this.functions.httpsCallable('callables-sendForgotPass');
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
            await this.auth.currentUser.updatePassword(password);

            return password;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="update_phone">
    async update_phone(evt, data) {
        return Events.whenLoggedIn(async loggedUser => {
            if (!data)
                return null;
            if (!isObject(data))
                return null;

            const {user_id: uid, phone, verificationId, code} = data;
            if (!uid) {
                return null;
            }
            if (!phone)
                return null;
            if (!verificationId)
                return null;
            if (!code)
                return null;

            const phoneCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

            const {currentUser} = this.auth;

            return currentUser.updatePhoneNumber(phoneCredential).then(async () => {
                const colRef = this.getDB().collection(this.tbl);

                let id = uid;
                if (this.isStaff) {
                    const getId = async (phoneNumber) => {
                        let snapshot = await colRef.where('phone', '==', phoneNumber).limit(1).get();
                        if (!snapshot || snapshot.empty) {
                            return null;
                        }
                        snapshot = snapshot.docs[0];
                        return snapshot.id;
                    };
                    //TODO: fix this process as it gets ID by phone number yet there might be no number
                    id = await getId(phone);
                }

                if (!id) {
                    return null;
                }

                const doc_ref = await colRef.doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                try {
                    await doc_ref.update({phone});
                    return true;
                } catch (err) {
                    return "UDATE_ERROR";
                }
            }).catch(err => {
                console.error(err);
                return err.code;
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getByUsername">
    async getByUsername(evt, username) {
        console.log('getByUsername')
        username = username.toLowerCase();

        let res, fn;
        if (this.isStaff) {
            fn = 'findByUsernameEmployee';
        } else {
            fn = 'findByUsernameUser';
        }

        res = await Events.emit(fn, username);
        console.log('getByUsername:', fn, res);

        if (!res) {
            return "NO_USER_DB";
        }

        const {id, data: {auth_id}} = res;
        return {id, auth_id};
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getUserUID">
    async getUserUID(evt, username) {
        console.log('getUserUID')
        username = username.toLowerCase();

        const path = `get/getUserUidByUsername/${this.access_type}`;

        const uid = await Utils.apiCallable(path, username);
        if (uid) {
            return uid;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="loginUsername">
    async loginUsername(evt, username) {
        console.log('loginUsername')
        const item = await this.getByUsername(evt, username);//if user:{id, auth_id}, if contractor:{contractor:{id, data}, message}
        if (!item || isString(item)) {
            return item;
        }

        if (this.isContractorUser) {
            //////if it's contractor//////
            const {contractor, message} = item;
            if (contractor) {
                return item;
            }
            //////////////////////////////
        }

        const {auth_id, id} = item;
        if (auth_id) {
            return {uid: auth_id, id};
        }

        const res = await Utils.apiCallable(`get/getUserUidByUsername`, username);
        if (!res) {
            return {id};
        }
        const {uid} = res;
        return {uid, id};
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="emailOTP">
    async emailOTP(evt, username) {
        console.log('emailOTP')
        username = username.toLowerCase();

        console.log('sendUserOTP')
        const path = `send/sendUserOTP/${this.access_type}`;

        const res = await Utils.apiCallable(path, username);
        if (!res) {
            return null;
        }
        console.log('sendUserOTP res', res)
        return res;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="confirmOTP">
    async confirmOTP(evt, attrs) {
        console.log('confirmOTP')

        console.log('confirmUserOTP')
        const path = `send/confirmUserOTP/${this.access_type}`;

        const res = await Utils.apiCallable(path, attrs);
        if (!res) {
            return null;
        }
        console.log('confirmUserOTP res', res)
        return res;
    }

    // </editor-fold>

}