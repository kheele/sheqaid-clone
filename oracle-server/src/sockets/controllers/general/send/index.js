
require('../../../../api/send');

class Cntr extends ACntr {
	constructor() {
		super('send/');

		const {addAction} = this;
		addAction('sendUserOTP', this.sendUserOTP.bind(this));
		addAction('confirmUserOTP', this.confirmUserOTP.bind(this));
		addAction('sendForgotPass', this.sendForgotPass.bind(this));
	}

	async sendUserOTP(socket, data = {}) {
		// console.log('data', data)

		const {username, access_type} = data;

		if (isValidAccessType(access_type)) {
			return sendUserOTP(username, access_type);
		}
	}

	async confirmUserOTP(socket, data = {}) {
		// console.log('data', data)

		const {access_type, username, code} = data;

		if (isValidAccessType(access_type)) {
			return confirmUserOTP({username, code}, access_type);
		}
	}

	async sendForgotPass(socket, data = {}) {
		// console.log('data', data)

		const {access_type, username} = data;

		if (isValidAccessType(access_type)) {
			return sendForgotPass(username, access_type);
		}
	}

}

module.exports = new Cntr();