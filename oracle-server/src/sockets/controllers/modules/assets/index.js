require('./vehicle-forms');
require('./docs');

class Cntr extends ACntr {
	constructor() {
		super('assets/');

		const {addAction} = this;
		addAction('insertAsset', this.insertAsset.bind(this));
	}

	async insertAsset(socket, data) {
		// console.log('data', data)

		let {query, variables} = data;

		let headers = {};
		if(socket.auth_id) {
			const currentUser = await admin.auth().getUser(socket.auth_id);
			console.log("relay variables", currentUser, socket.auth_id, variables)
			if (currentUser) {
				const token = await currentUser.getIdToken(true);
				headers.Authorization = `Bearer ${token}`;
				headers["X-Hasura-User-Id"] = currentUser.uid;
				headers["X-Hasura-Role"] = "user";
			}
		}

		if (variables && "headers" in variables) {
			headers = {...headers, ...variables.headers};
			// eslint-disable-next-line no-param-reassign
			delete variables.headers;
		}

		return fetch(process.env.HASURA_RELAY_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-hasura-access-key": process.env.HASURA_ADMIN_SECRET,
				...headers,
			},
			body: JSON.stringify({query, variables}),
		}).
		then(res => res.json()).
		catch(err => {
			console.error("response err", err)
			throw err;
		});
	}

}

module.exports = new Cntr();