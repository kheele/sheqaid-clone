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

            const csrfToken = await Utils.cookie('csrfToken');
            console.log("csrfToken", csrfToken)

            const res = await socket.emit('emit', {
                path: 'accounts/onSetCustomUserClaims',
                data: {access_type: this.access_type, idToken, csrfToken},
            });
            if (res) {
                return convertMutations(res);
            }
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
        return socket.emit('emit', {
            path: 'accounts/sign/onReAuthUser',
            data: {access_type: this.access_type, uid},
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="logout">
    async logoutImpl(evt) {
        return socket.emit('emit', {
            path: 'accounts/sign/out',
            data: {access_type: this.access_type,},
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="forgot_passImpl">
    async forgot_passImpl(evt, username) {
        return socket.emit('emit', {
            path: 'send/sendForgotPass',
            data: {access_type: this.access_type, username,},
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getUserUIDImpl">
    async getUserUIDImpl(evt, username) {
        console.log('getUserUID')
        username = username.toLowerCase();

        return socket.emit('emit', {
            path: 'get/getUserUidByUsername',
            data: {access_type: this.access_type, username,},
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getUserUidByUsername">
    async getUserUidByUsername(evt, username) {
        const res = await socket.emit('emit', {
            path: 'get/getUserUidByUsername',
            data: {access_type: this.access_type, username,},
        });
        return res && res.uid;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="emailOTPImpl">
    async emailOTPImpl(evt, username) {
        return socket.emit('emit', {
            path: 'send/sendUserOTP',
            data: {access_type: this.access_type, username,},
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="confirmOTPImpl">
    async confirmOTPImpl(evt, attrs) {
        const {username, code} = attrs;

        return socket.emit('emit', {
            path: 'send/confirmUserOTP',
            data: {access_type: this.access_type, username, code,},
        });
    }

    // </editor-fold>

}