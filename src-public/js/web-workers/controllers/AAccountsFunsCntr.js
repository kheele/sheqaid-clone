class AAccountsFunsCntr extends AControllerRead {
    constructor(events, name, root, tbl, fn) {
        super(events, name, root, tbl, fn);
    }

    // <editor-fold defaultstate="collapsed" desc="onSetCustomUserClaimsImpl">
    async onSetCustomUserClaimsImpl(userOrToken) {
        const onSetCustomUserClaims = this.functions.httpsCallable('callables-onSetCustomUserClaims');
        let res = await onSetCustomUserClaims(userOrToken);
        console.log('onSetCustomUserClaimsImpl', res)
        return res && res.data;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="loginBiometricImpl">
    async loginBiometricImpl(evt, {username, match, displaySize}) {
        console.log('loginBiometric')
        username = username.toLowerCase();

        const onLoginBiometric = this.functions.httpsCallable('callables-onLoginBiometric');
        const res = await onLoginBiometric({username, match, displaySize});
        return res && res.data;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setupBiometricImpl">
    async setupBiometricImpl(evt, {uid, imgSrc}) {
        console.log('setupBiometric')
        const onSetupBiometric = this.functions.httpsCallable('callables-onSetupBiometric');
        const res = await onSetupBiometric({uid, imgSrc});
        return res && res.data;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="reloginImpl">
    async reloginImpl(evt, uid) {
        const onReAuthContractorUser = this.functions.httpsCallable('callables-onReAuthContractorUser');
        const res = await onReAuthContractorUser(uid);
        return res && res.data;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="logout">
    async logoutImpl(evt) {
        return true;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="forgot_passImpl">
    async forgot_passImpl(evt, username) {
        const sendForgotPass = this.functions.httpsCallable('callables-sendForgotPass');
        const res = await sendForgotPass(username);
        console.log('forgot_pass res', res)
        return res && res.data;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getUserUIDImpl">
    async getUserUIDImpl(evt, username) {
        console.log('getUserUID')
        username = username.toLowerCase();

        const getUserUidByUsername = this.functions.httpsCallable('callables-getUserUidByUsername');
        const res = await getUserUidByUsername(username);
        return res && res.data;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="loginUsernameImpl">
    async loginUsernameImpl(evt, username) {
        const getUserUidByUsername = this.functions.httpsCallable('callables-getUserUidByUsername');
        const res = await getUserUidByUsername(username);
        return res && res.data;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="emailOTPImpl">
    async emailOTPImpl(evt, username) {
        console.log('emailOTP')
        username = username.toLowerCase();

        console.log('sendUserOTP')
        const sendUserOTP = this.functions.httpsCallable('callables-sendUserOTP');
        const res = await sendUserOTP(username);
        return res && res.data;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="confirmOTPImpl">
    async confirmOTPImpl(evt, attrs) {
        console.log('confirmOTP')
//            username = username.toLowerCase();

        console.log('confirmUserOTP')
        const confirmUserOTP = this.functions.httpsCallable('callables-confirmUserOTP');
        const res = await confirmUserOTP(attrs);
        return res && res.data;
    }

    // </editor-fold>

}