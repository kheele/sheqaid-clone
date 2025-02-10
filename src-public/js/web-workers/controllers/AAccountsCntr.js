//AAccountsFunsCntr || AAccountsServerCntr

class AAccountsCntr extends AAccountsServerCntr {
// class AAccountsCntr extends AAccountsFunsCntr {
    constructor(events, name, root, tbl, fn) {
        super(events, name, root, tbl, fn);

        const {addAction} = this;

        addAction("login", this.login.bind(this));
        addAction("login-auto", this.loginAuto.bind(this));

        addAction("login/biometric", this.loginBiometric.bind(this));
        addAction("setup/biometric", this.setupBiometric.bind(this));

        addAction("logout", this.logout.bind(this));

        addAction("forgot-pass", this.forgot_pass.bind(this));
        addAction("change-pass", this.change_pass.bind(this));
        addAction("setup-phone", this.setup_phone.bind(this));

        //this is for all users in firebase
        addAction("check/auth/username", this.getUserUID.bind(this));
        addAction("email/otp", this.emailOTP.bind(this));
        addAction("confirm/otp", this.confirmOTP.bind(this));
    }

    // <editor-fold defaultstate="collapsed" desc="onSetCustomUserClaims">
    async onSetCustomUserClaims(userOrToken) {
        return this.onSetCustomUserClaimsImpl(userOrToken);
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

        let res = await this.loginBiometricImpl(evt, {username, match, displaySize});
        if (!res) {
            return null;
        }
        if (isString(res)) {
            return res;
        }

        const {customToken} = res;
        console.log('loginBiometric customToken')
        res = await this.auth.signInWithCustomToken(customToken).then(async userCredential => {
            if (!userCredential)
                return null;
            const {user} = userCredential;
            const res = await this.onSetCustomUserClaims(user);
            return this.loginImpl(res);
            // if (this.isStaff) {
            //     return this.loginImpl(user.email);
            // } else {
            //     return this.loginImpl(user.uid);
            // }
        });
        return res;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setupBiometric">
    async setupBiometric(evt, {uid, imgSrc}) {
        console.log('setupBiometric')
        let res = await this.setupBiometricImpl(evt, {uid, imgSrc});
        if (!res) {
            return null;
        }
        if (isString(res)) {
            return res;
        }

        const {customToken} = res;
        console.log('setupBiometric res')
        res = await this.auth.signInWithCustomToken(customToken).then(async userCredential => {
            if (!userCredential)
                return null;
            const {user} = userCredential;
            const res = await this.onSetCustomUserClaims(user);
            return this.loginImpl(res);
            // if (this.isStaff) {
            //     return this.loginImpl(user.email);
            // } else {
            //     return this.loginImpl(user.uid);
            // }
        });
        return res;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="relogin">
    async relogin(evt, uid) {
        console.log('relogin')

        let res = await this.reloginImpl(evt, uid);
        if (!res) {
            return null;
        }
        if (isString(res)) {
            return res;
        }

        const {customToken} = res;
        console.log('relogin contractor customToken')
        res = await this.auth.signInWithCustomToken(customToken).then(async userCredential => {
            if (!userCredential)
                return null;
            const {user} = userCredential;
            const res = await this.onSetCustomUserClaims(user);
            return this.loginImpl(res);
            // if (this.isStaff) {
            //     return this.loginImpl(user.email);
            // } else {
            //     return this.loginImpl(user.uid);
            // }
        });
        return res;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="loginImpl">
    async loginImpl(res) {
        if (res) {
            let {loggedUser, customToken} = res;
            loggedUser = {...loggedUser, access_type: this.access_type};

            self.session.loginUser(loggedUser, this.auth);
            return {loggedUser, customToken};
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
        return Events.whenLoggedIn(async loggedUser => {
            let res = await this.logoutImpl(evt);
            console.log('logout res', res)

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

        return this.forgot_passImpl(evt, username);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="change_pass">
    async change_pass(evt, password) {
        return Events.whenLoggedIn(async loggedUser => {
            await this.auth.currentUser.updatePassword(password);

            return password;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setup_phone">
    async setup_phone(evt, data) {
        return Events.whenLoggedIn(async loggedUser => {
            if (!data)
                return null;
            if (!isObject(data))
                return null;

            const {verificationId, code} = data;
            if (!verificationId)
                return null;
            if (!code)
                return null;

            const phoneCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

            const {currentUser} = this.auth;
            return currentUser.updatePhoneNumber(phoneCredential).then(() => true).catch(err => {
                console.error(err);
                return err.code;
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getUserUID">
    async getUserUID(evt, username) {
        return this.getUserUIDImpl(evt, username);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="emailOTP">
    async emailOTP(evt, username) {
        return this.emailOTPImpl(evt, username);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="confirmOTP">
    async confirmOTP(evt, attrs) {
        return this.confirmOTPImpl(evt, attrs);
    }

    // </editor-fold>

}
