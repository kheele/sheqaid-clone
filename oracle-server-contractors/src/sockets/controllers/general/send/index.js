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
		
		const {username} = data;
		return sendUserOTP(username);
	}
	
	async confirmUserOTP(socket, data = {}) {
		// console.log('data', data)
		
		const {username, code} = data;
		return confirmUserOTP({username, code});
	}
	
	async sendForgotPass(socket, data = {}) {
		// console.log('data', data)
		
		const {username} = data;
		return sendForgotPass(username);
	}
	
}

module.exports = new Cntr();
