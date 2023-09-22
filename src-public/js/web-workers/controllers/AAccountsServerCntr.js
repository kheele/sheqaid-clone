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

            return new Promise((resolve, reject) => {
                socket.emit('emit', {
                    path: 'accounts/onSetCustomUserClaims',
                    data: {access_type: this.access_type, idToken, csrfToken},
                }, (res, err) => {
                    if(err) {
                        console.log('onSetCustomUserClaimsImpl emit err', err)
                        return reject(err);
                    }

                    console.log('onSetCustomUserClaimsImpl emit res', res)
                    if(res) {
                        resolve(convertMutations(res));
                    } else {
                        resolve();
                    }
                });
            });
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
        return new Promise((resolve, reject) => {
            socket.emit('emit', {
                path: 'accounts/sign/onReAuthUser',
                data: {access_type: this.access_type, uid},
            }, (res, err) => {
                if(err) {
                    console.log('reloginImpl emit err', err)
                    return reject(err);
                }

                console.log('reloginImpl emit res', res)
                resolve(res);
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="logout">
    async logoutImpl(evt) {
        return new Promise((resolve, reject) => {
            socket.emit('emit', {
                path: 'accounts/sign/out',
                data: {access_type: this.access_type,},
            }, (res, err) => {
                if(err) {
                    console.log('logoutImpl emit err', err)
                    return reject(err);
                }

                console.log('logoutImpl emit res', res)
                resolve(res);
            });
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="forgot_passImpl">
    async forgot_passImpl(evt, username) {
        return new Promise((resolve, reject) => {
            socket.emit('emit', {
                path: 'send/sendForgotPass',
                data: {access_type: this.access_type, username,},
            }, (res, err) => {
                if(err) {
                    console.log('forgot_passImpl emit err', err)
                    return reject(err);
                }

                console.log('forgot_passImpl emit res', res)
                resolve(res);
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getUserUIDImpl">
    async getUserUIDImpl(evt, username) {
        console.log('getUserUID')
        username = username.toLowerCase();

        return new Promise((resolve, reject) => {
            socket.emit('emit', {
                path: 'get/getUserUidByUsername',
                data: {access_type: this.access_type, username,},
            }, (uid, err) => {
                if(err) {
                    console.log('getUserUIDImpl emit err', err)
                    return reject(err);
                }

                console.log('getUserUIDImpl emit res', uid)
                resolve(uid);
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="loginUsernameImpl">
    async loginUsernameImpl(evt, username) {
        return new Promise((resolve, reject) => {
            socket.emit('emit', {
                path: 'get/getUserUidByUsername',
                data: {access_type: this.access_type, username,},
            }, (res, err) => {
                if(err) {
                    console.log('loginUsernameImpl emit err', err)
                    return reject(err);
                }

                console.log('loginUsernameImpl emit res', res)
                if(res) {
                    resolve(res.uid);
                } else {
                    resolve();
                }
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="emailOTPImpl">
    async emailOTPImpl(evt, username) {
        return new Promise((resolve, reject) => {
            socket.emit('emit', {
                path: 'send/sendUserOTP',
                data: {access_type: this.access_type, username,},
            }, (res, err) => {
                if(err) {
                    console.log('emailOTPImpl emit err', err)
                    return reject(err);
                }

                console.log('emailOTPImpl emit res', res)
                resolve(res);
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="confirmOTPImpl">
    async confirmOTPImpl(evt, attrs) {
        const {username, code} = attrs;

        return new Promise((resolve, reject) => {
            socket.emit('emit', {
                path: 'send/confirmUserOTP',
                data: {access_type: this.access_type, username, code,},
            }, (res, err) => {
                if(err) {
                    console.log('confirmOTPImpl emit err', err)
                    return reject(err);
                }

                console.log('confirmOTPImpl emit res', res)
                resolve(res);
            });
        });
    }

    // </editor-fold>

}