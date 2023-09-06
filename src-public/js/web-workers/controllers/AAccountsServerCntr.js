class AAccountsServerCntr extends AControllerRead {
    constructor(events, name, root, tbl, fn) {
        super(events, name, root, tbl, fn);
    }

    // <editor-fold defaultstate="collapsed" desc="onSetCustomUserClaimsImpl">
    async onSetCustomUserClaimsImpl(userOrToken) {
        console.log("onSetCustomUserClaimsImpl", this.access_type, userOrToken)
        const process = async (idToken) => {
            // Session login endpoint is queried and the session cookie is set.
            // CSRF protection should be taken into account.
            // ...

            const path = `accounts/onSetCustomUserClaims/${this.access_type}`;

            const csrfToken = await Utils.cookie('csrfToken');
            console.log("csrfToken", csrfToken)
            const res = await Utils.apiCallable({path, data: {
                idToken, csrfToken
            }});
            return convertMutations(res);
        };

        if (isString(userOrToken)) {
            return process(userOrToken);
        }
        return userOrToken.getIdToken(true).then(process);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="loginBiometricImpl">
    async loginBiometricImpl(evt, {username, match, displaySize}) {
        const path = `biometric/onLoginBiometric/${this.access_type}`;

        const res = await Utils.apiCallable({path, data: {username, match, displaySize}});
        return res;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setupBiometricImpl">
    async setupBiometricImpl(evt, {uid, imgSrc}) {
        const path = `biometric/onSetupBiometric/${this.access_type}`;

        const res = await Utils.apiCallable({path, data: {uid, imgSrc}});
        return res;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="reloginImpl">
    async reloginImpl(evt, uid) {
        const path = `accounts/sign/onReAuthUser/${this.access_type}`;

        const res = await Utils.apiCallable({path, data: uid});
        return res;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="logout">
    async logoutImpl(evt) {
        const path = `accounts/sign/out/${this.access_type}`;

        const res = await Utils.apiCallable({path});
        console.log('logoutImpl res', res)
        return res;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="forgot_passImpl">
    async forgot_passImpl(evt, username) {
        const path = `send/sendForgotPass/${this.access_type}`;

        const res = await Utils.apiCallable({path, data: username});
        console.log('forgot_pass res', res)
        return res;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getUserUIDImpl">
    async getUserUIDImpl(evt, username) {
        console.log('getUserUID')
        username = username.toLowerCase();

        const path = `get/getUserUidByUsername/${this.access_type}`;
        console.log('getUserUIDImpl', path)

        const uid = await Utils.apiCallable({path, data: username});
        return uid;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="loginUsernameImpl">
    async loginUsernameImpl(evt, username) {
        const res = await Utils.apiCallable({path: `get/getUserUidByUsername`, data: username});
        return res && res.uid;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="emailOTPImpl">
    async emailOTPImpl(evt, username) {
        console.log('emailOTP')
        username = username.toLowerCase();

        console.log('sendUserOTP')
        const path = `send/sendUserOTP/${this.access_type}`;

        const res = await Utils.apiCallable({path, data: username});
        if (!res) {
            return null;
        }
        console.log('sendUserOTP res', res)
        return res;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="confirmOTPImpl">
    async confirmOTPImpl(evt, attrs) {
        console.log('confirmOTP')

        console.log('confirmUserOTP')
        const path = `send/confirmUserOTP/${this.access_type}`;

        const res = await Utils.apiCallable({path, data: attrs});
        return res;
    }

    // </editor-fold>

}