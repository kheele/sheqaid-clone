
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

	async signOut(socket, data = {}) {
		// console.log('data', data)

		let {access_type} = data;
		const {session} = socket.request;

		return signOut({
			session,
			sessionCookie: socket.request.cookies.session || '',
			access_type,
		})
		.then((res) => {
			if(res) {
				socket.auth_uid = null;
				socket.handshake.headers.cookie = `session=`;
				// res.clearCookie('session');
				return res;
			}
		})
		.catch((error) => {
			socket.handshake.headers.cookie = `session=`;
			return true;
		});
	}

	async onReAuthUser(socket, data = {}) {
		// console.log('data', data)

		const {access_type, uid} = data;

		return onReAuthUser({
			access_type,
			uid,
		});
	}

	async onSetCustomUserClaims(socket, data = {}) {
		// console.log('data', data)

		const {access_type, idToken, csrfToken} = data;
		// const {session} = socket.request;

		return onSetCustomUserClaims({
			data: {idToken, csrfToken},
			access_type,
			onSetCookie: (sessionCookie, options) => {
				socket.handshake.headers.cookie = `session=${sessionCookie}`;
			},
		}).then(res => {
			console.log('onSetCustomUserClaims user logged', socket.id, socket.auth_uid, res.token);
			if(res && res.token) {
				const {loggedUser, token, customClaims} = res;
				socket.auth_uid = customClaims.loggedUser.user.auth_id;
				// socket.token = token;
				socket.customClaims = customClaims;
				console.log('user logged', socket.id, socket.auth_uid);
				return {loggedUser, token};
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

		const {access_type} = data;

		if (isValidAccessType(access_type)) {
			return onResetPassword(data, access_type);
		}
	}

}

module.exports = new Cntr();
