require('../../../../api/get');

class Cntr extends ACntr {
	constructor() {
		super('get/');
		
		const {addAction} = this;
		addAction('getUserUidByUsername', this.getUserUidByUsername.bind(this));
		addAction('getUserUidByEmail', this.getUserUidByEmail.bind(this));
		addAction('getUserUidByPhone', this.getUserUidByPhone.bind(this));
	}
	
	async getUserUidByUsername(socket, data = {}) {
		// console.log('data', data)
		
		const {username} = data;
		return getUserUidByUsername(username);
	}
	
	async getUserUidByEmail(socket, data = {}) {
		// console.log('data', data)
		
		const {email} = data;
		return getUserUidByEmail(email);
	}
	
	async getUserUidByPhone(socket, data = {}) {
		// console.log('data', data)
		
		const {phone} = data;
		return getUserUidByPhone(phone);
	}
	
}

module.exports = new Cntr();
