const {convertMutations} = require("../../../graphql/convertMutations");

class Cntr extends ACntr {
	constructor() {
		super('graphql/');

		const {addAction} = this;
		addAction('v1beta1/relay', this.relay.bind(this));
		addAction('v1/graphql', this.default.bind(this));
		addAction('api/rest/views', this.views.bind(this));
	}

	async relay(socket, data = {}) {
		// console.log('data', data)

		let {query, variables} = data;

		let headers = {};
		const {currentUser} = admin.auth();
		console.log("currentUser, variables", currentUser, variables)
		if (currentUser) {
			const token = await currentUser.getIdToken();
			headers.Authorization = `Bearer ${token}`;
			headers["X-Hasura-User-Id"] = currentUser.uid;
			headers["X-Hasura-Role"] = "user";
		}
		if (variables && "headers" in variables) {
			headers = {...headers, ...variables.headers};
			// eslint-disable-next-line no-param-reassign
			delete variables.headers;
		}

		return fetch("http://cloud.sheqaid.com:8080/v1beta1/relay", {
			// fetch("http://hasura.cloud.sheqaid.com/v1beta1/relay", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-hasura-access-key": "rhespo-g",
				...headers,
			},
			body: JSON.stringify({query, variables}),
		}).then(res => res.json()).catch(err => {
			console.log("response err", err.message)
			throw err;
		});
	}

	async default(socket, data = {}) {
		// console.log('data', data)

		const {mutation, query, variables, multi_queries, count} = data;

		let headers = {};
		const {currentUser} = admin.auth();
		console.log("currentUser, variables", currentUser, variables)
		if (currentUser) {
			const token = await currentUser.getIdToken();
			headers.Authorization = `Bearer ${token}`;
			headers["X-Hasura-User-Id"] = currentUser.uid;
			headers["X-Hasura-Role"] = "user";
		}
		if (variables && "headers" in variables) {
			headers = {...headers, ...variables.headers};
			// eslint-disable-next-line no-param-reassign
			delete variables.headers;
		}

		if (mutation) {
			return client
			.mutation(mutation, variables)
			.toPromise()
			.then(async res => {
				console.log(res); // { data: ... }

				const {error, data} = res;

				const key = Object.keys(data)[0];
				const list = data[key];
				// console.log('connection', connection)
				const node = list.map(node => {
					node = convertMutations(node);
					if (node.id) {
						return {data: node, id: node.id};
					} else {
						return node;
					}
				})[0];
				console.log("onCompleted node", node);
				return node;
			})
			.catch(err => {
				console.log(mutation);
				throw err;
			});
		}

		return fetch("http://cloud.sheqaid.com:8080/v1/graphql", {
			// fetch("http://hasura.cloud.sheqaid.com/v1/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-hasura-access-key": "rhespo-g",
				...headers,
			},
			body: JSON.stringify({query, variables}),
		}).then(res => res.json()).then(res => {
			console.log(res); // { data: ... }
			const {error, data} = res;

			if (multi_queries) {
				if (!count) {
					Object.keys(data).forEach(key => {
						const list = data[key];
						list.forEach(node => {
							convertMutations(node);
						});
					});
				}
				return data;
			} else {
				const key = Object.keys(data)[0];
				const list = data[key];
				// console.log('connection', connection)
				const nodes = list.map(node => {
					node = convertMutations(node);
					if (node.id) {
						return {data: node, id: node.id};
					} else {
						return node;
					}
				});
				// console.log("onCompleted nodes", nodes);
				return nodes;
			}
		}).catch(err => {
			console.log("response err", err.message)
			throw err;
		});
	}

	async views(socket, path) {
		// console.log('data', path)

		let headers = {};
		const {currentUser} = admin.auth();
		if (currentUser) {
			const token = await currentUser.getIdToken();
			headers.Authorization = `Bearer ${token}`;
			headers["X-Hasura-User-Id"] = currentUser.uid;
			headers["X-Hasura-Role"] = "user";
		}

		return fetch(`http://cloud.sheqaid.com:8080/api/rest/${path}`, {
			// fetch(`http://hasura.cloud.sheqaid.com/api/rest/${path}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-hasura-access-key": "rhespo-g",
				...headers,
			},
		}).then(res => res.json()).catch(err => {
			console.log("response err", err.message)
			throw err;
		});
	}

}

module.exports = new Cntr();