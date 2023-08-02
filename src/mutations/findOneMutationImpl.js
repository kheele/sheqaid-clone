/* eslint-disable camelcase */

// 1
import {fetchQuery} from "react-relay";
import environment from "Environment";
import {convertMutations} from "./convertMutations";

// 2
export default async ({checkLogin = true, query, variables}) => {
	// eslint-disable-next-line no-unused-vars
	const {is} = storage;
	if (checkLogin && !is.isLoggedInAuth) {
		// return Promise.reject(new Error('Unauthorized request'));
	}

	// 4
	return fetchQuery(environment, query, variables, {singleResult: true})
	.toPromise()
	.then(async (res) => {
		const key = Object.keys(res)[0];
		const connection = res[key];
		// console.log('connection', connection)
		const {edges = []} = connection;
		let [edge] = edges;
		let {node = null} = edge || {};
		node = convertMutations(node);
		if (node && node.id) {
			node = {data: node, id: node.id};
		}
		// console.log("onCompleted node", node);
		return node;
	})
	.catch((err) => {
		console.error(err);
		throw err;
	});
};
