require('../../../../api/accounts');

const {
    sendWelcomeEmail,
    sendWelcomeOTP,
    sendNewContractorSiteEmail,
    sendUpdateStatusContractorSiteEmail,
    onResetPassword,
} = accountsApi;

class Cntr extends ACntr {
    constructor() {
        super('accounts/');

        const {addAction} = this;
        addAction('sign/out', this.signOut.bind(this));
        addAction('sign/onReAuthUser', this.onReAuthUser.bind(this));
        addAction('onSetCustomUserClaims', this.onSetCustomUserClaims.bind(this));
        addAction('sendWelcomeEmail', this.sendWelcomeEmail.bind(this));
        addAction('sendWelcomeOTP', this.sendWelcomeOTP.bind(this));
        addAction('sendNewContractorSiteEmail', this.sendNewContractorSiteEmail.bind(this));
        addAction('sendUpdateStatusContractorSiteEmail', this.sendUpdateStatusContractorSiteEmail.bind(this));
        addAction('onResetPassword', this.onResetPassword.bind(this));
    }

    async signOut(socket) {
        const {session, session: {auth_id}} = socket.request;

        return signOut({
            session,
            sessionCookie: session.sessionCookie || '',
            // sessionCookie: socket.request.cookies.session || '',
        })
            .then((res) => {
                if (res) {
                    socket.leave(auth_id);
                    return res;
                }
            });
            // .catch((error) => {
            //     socket.handshake.headers.cookie = `session=`;
            //     return true;
            // });
    }

    async onReAuthUser(socket, data = {}) {
        // console.log('data', data)

        const {uid} = data;

        return onReAuthUser({
            uid,
        });
    }

    async onSetCustomUserClaims(socket, data = {}) {
        // console.log('data', data)

        const {idToken, csrfToken} = data;
        const {session} = socket.request;

        console.log('onSetCustomUserClaims', idToken, csrfToken);

        return onSetCustomUserClaims({
            idToken, csrfToken,
        }).then(res => {
            console.log('onSetCustomUserClaims user logged', socket.id, session.auth_id);
            if (res && res.customToken) {
                const {loggedUser, customToken, customClaims, sessionCookie, options} = res;

                session.sessionCookie = sessionCookie;

                session.auth_id = customClaims.loggedUser.user.auth_id;
                session.access_type = "ContractorUser";
                session.customClaims = customClaims;
                session.save();

                socket.join(session.auth_id);

                console.log('user logged', socket.id, session.auth_id);

                // socket.auth_id = customClaims.loggedUser.user.auth_id;
                // socket.customToken = customToken;
                // socket.customClaims = customClaims;
                // console.log('user logged', socket.id, socket.auth_id);
                return {loggedUser, customToken, customClaims, sessionCookie, options};
            }
            return res;
        });
    }

    //Hasuara triggers
    async sendWelcomeEmail(socket, data = {}) {
        // console.log('data', data)

        return sendWelcomeEmail(data);
    }

    async sendWelcomeOTP(socket, data = {}) {
        // console.log('data', data)

        return sendWelcomeOTP(data);
    }

    async sendNewContractorSiteEmail(socket, data = {}) {
        // console.log('data', data)

        return sendNewContractorSiteEmail(data);
    }

    async sendUpdateStatusContractorSiteEmail(socket, data = {}) {
        // console.log('data', data)

        return sendUpdateStatusContractorSiteEmail(data);
    }

    //From forgot password page sent by email link
    async onResetPassword(socket, data = {}) {
        // console.log('data', data)

        return onResetPassword(data);
    }

}

module.exports = new Cntr();
