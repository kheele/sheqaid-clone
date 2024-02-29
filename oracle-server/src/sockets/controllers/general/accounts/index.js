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
		addAction('onSetCustomUserClaims', this._onSetCustomUserClaims.bind(this));
		addAction('sendWelcomeEmail', this.sendWelcomeEmail.bind(this));
		addAction('sendWelcomeOTP', this.sendWelcomeOTP.bind(this));
		addAction('sendNewContractorSiteEmail', this.sendNewContractorSiteEmail.bind(this));
		addAction('sendUpdateStatusContractorSiteEmail', this.sendUpdateStatusContractorSiteEmail.bind(this));
		addAction('onResetPassword', this.onResetPassword.bind(this));
	}
	
	async signOut(socket, data = {}) {
		// console.log('data', data)
		
		let {access_type} = data;
		const {session, session: {auth_id}} = socket.handshake;
		
		return signOut({
			session,
			sessionCookie: session.sessionCookie || '',
			// sessionCookie: socket.request.cookies.session || '',
			access_type,
		}).then((res) => {
			if (res) {
				socket.leave(auth_id);
				
				delete session.sessionCookie;
				delete session.auth_id;
				delete session.access_type;
				delete session.customClaims;
				session.save();
				
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
		
		const {access_type, uid} = data;
		
		return onReAuthUser({
			access_type,
			uid,
		});
	}
	
	async _onSetCustomUserClaims(socket, data = {}) {
		// console.log('data', data)
		
		const {access_type, idToken, csrfToken} = data;
		const {session} = socket.handshake;
		
		console.log('_onSetCustomUserClaims', access_type, idToken, csrfToken);
		
		return onSetCustomUserClaims({
			idToken,
			csrfToken,
			access_type,
		}).then(res => {
			console.log('_onSetCustomUserClaims user logged', socket.id, session.auth_id);
			if (res && res.customToken) {
				const {loggedUser, customToken, customClaims, sessionCookie, options} = res;
				
				session.sessionCookie = sessionCookie;
				
				session.auth_id = customClaims.loggedUser.user.auth_id;
				session.access_type = access_type;
				session.customClaims = customClaims;
				session.save();
				
				socket.join(session.auth_id);
				
				console.log('user logged', socket.id, session.auth_id);
				
				// socket.auth_id = customClaims.loggedUser.user.auth_id;
				// socket.token = token;
				// socket.customClaims = customClaims;
				// console.log('user logged', socket.id, socket.auth_id);
				return {loggedUser, customToken};
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
