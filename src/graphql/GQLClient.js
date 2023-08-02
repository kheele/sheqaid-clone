import {createClient, dedupExchange, fetchExchange, subscriptionExchange, } from '@urql/core';
import { createClient as createWSClient } from 'graphql-ws';
import {convertMutations} from 'mutations/convertMutations';
import { pipe, subscribe } from 'wonka';

const wsClient = createWSClient({
	url: "ws://cloud.sheqaid.com:8080/v1/graphql",
});

const client = createClient({
	url: "https://cloud.sheqaid.com:5000/v1/graphql",
	requestPolicy: 'network-only',
	fetchOptions: () => {
		const headers = {};
		const {is, loggedUserAuth} = storage;
		if (is.isLoggedInAuth) {
			// const idTokenResult = await execWhen(() => storage.idTokenResult);
			const idTokenResult = storage.idTokenResult;
			const {token} = idTokenResult;
			headers.Authorization = `Bearer ${token}`;
			headers["X-Hasura-User-Id"] = loggedUserAuth.uid;
			headers["X-Hasura-Role"] = "user";
		}

		return {
			headers: {
				"Content-Type": "application/json",
				"x-hasura-access-key": "rhespo-g",
				...headers,
			},
		};
	},
	exchanges: [
		dedupExchange,
		fetchExchange,
		subscriptionExchange({
			forwardSubscription(request) {
				const input = { ...request, query: request.query || '', subscription: request.subscription || '' };
				return {
					subscribe(sink) {
						const unsubscribe = wsClient.subscribe(input, sink);
						return { unsubscribe };
					},
				};
			},
		}),
	],
});

class GQLClient {
	static async query({query, variables, multi_queries = false, count = false}) {
		return client
		.query(query, variables)
		.toPromise()
		.then(async res => {
			console.log(res); // { data: ... }

			// const worker = new WebWorker(() => {
			// 	Events.on("process", async (db, {multi_queries, res}) => {
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
				console.log("onCompleted nodes", nodes);
				return nodes;
			}
			// 	});
			// });
			// res = await worker.emit("process", {multi_queries, res});
			// worker.terminate();
			// return res;
		})
		.catch(err => {
			console.log(query);
			throw err;
		});
	}

	static async mutation({mutation: query, variables}) {
		return client
		.mutation(query, variables)
		.toPromise()
		.then(async res => {
			console.log(res); // { data: ... }

			// const worker = new WebWorker(() => {
			// 	Events.on("process", async (db, res) => {
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
			// });
			// });
			// res = await worker.emit("process", res);
			// worker.terminate();
			// return res;
		})
		.catch(err => {
			console.log(mutation);
			throw err;
		});
	}

	static async subscription({query, variables, multi_queries = false, count = false, onEvent}) {
		// client.subscription(query)(sink => {
		// 	const unsubscribe = wsClient.subscribe(input, sink);
		// 	return { unsubscribe };
		// })/*.subscribe(res => {
		// 	console.log('subscription res', res)
		//
		// 	const {error, data} = res;
		//
		// 	if (multi_queries) {
		// 		if (!count) {
		// 			Object.keys(data).forEach(key => {
		// 				const list = data[key];
		// 				list.forEach(node => {
		// 					convertMutations(node);
		// 				});
		// 			});
		// 		}
		// 		onEvent(data);
		// 	} else {
		// 		const key = Object.keys(data)[0];
		// 		let list = data[key];
		// 		if(isNullable(list)) {
		// 			onEvent();
		// 		} else {
		// 			const  is_arr = isArray(list);
		// 			if (!is_arr) {
		// 				list = [list];
		// 			}
		//
		// 			// console.log('connection', connection)
		// 			const nodes = list.map(node => {
		// 				node = convertMutations(node);
		// 				if (node.id) {
		// 					return {data: node, id: node.id};
		// 				} else {
		// 					return node;
		// 				}
		// 			});
		//
		// 			if (is_arr) {
		// 				console.log("onCompleted nodes", nodes);
		// 				onEvent(nodes);
		// 			} {
		// 				console.log("onCompleted node", nodes[0]);
		// 				onEvent(nodes[0]);
		// 			}
		// 		}
		// 	}
		// });*/
		const { unsubscribe } = pipe(
			client.subscription(query, variables),
			subscribe(res => {
				console.log(res); // OperationResult

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
					onEvent(data);
				} else {
					const key = Object.keys(data)[0];
					let list = data[key];
					if(isNullable(list)) {
						onEvent();
					} else {
						const  is_arr = isArray(list);
						if (!is_arr) {
							list = [list];
						}

						// console.log('connection', connection)
						const nodes = list.map(node => {
							node = convertMutations(node);
							if (node.id) {
								return {data: node, id: node.id};
							} else {
								return node;
							}
						});

						if (is_arr) {
							console.log("onCompleted nodes", nodes);
							onEvent(nodes);
						} {
							console.log("onCompleted node", nodes[0]);
							onEvent(nodes[0]);
						}
					}
				}
			})
		);
		return unsubscribe;
	}
}

export default GQLClient;