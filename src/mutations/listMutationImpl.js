/* eslint-disable camelcase */

// 1
import {fetchQuery} from "react-relay";
import environment from "Environment";
import ViewsClient from "../graphql/ViewsClient";
import findByIdCompany from "./all/Company/findByIdCompany";
import findByIdClient from "./all/Client/findByIdClient";
import findByIdProject from "./all/Project/findByIdProject";
import findByIdSite from "./all/Site/findByIdSite";
import findByIdContractor from "./all/Contractor/findByIdContractor";
import findByIdContractorSite from "./all/ContractorSite/findByIdContractorSite";
import {convertMutations} from "./convertMutations";

// 2
export default async ({checkLogin = true, path, query, variables}) => {
	// eslint-disable-next-line no-unused-vars
	const {is} = storage;
	if (checkLogin && !is.isLoggedInAuth) {
		return;
	}

	if (path) {
		return ViewsClient.fetchQuery({path})
		.then(async (res) => {
			const key = Object.keys(res)[0];
			const list = res[key];

			if (!list) {
				console.log('ViewsClient.fetchQuery then', path, list, 'no list')
				return [];
			}

			const nodes = await Promise.all(list.map(async node => {
				[
					{key: 'company', fn: findByIdCompany},
					{key: 'client', fn: findByIdClient},
					{key: 'project', fn: findByIdProject},
					{key: 'site', fn: findByIdSite},
					{key: 'contractor', fn: findByIdContractor},
					{key: 'contractor_site', fn: findByIdContractorSite},
				].filter(({key}) => node[`${key}_id`]).map(async ({key, fn}) => {
					return fn(node[`${key}_id`]).then(item => ({
						id: item.id, name: item.data.name
					})).then(item => node[`${key}`] = item)
				});

				if (node.id) {
					const id = convertIdToBigint(node.id);
					return {...node, id};
				} else {
					return node;
				}
			}));
			// console.log("onCompleted nodes", nodes);
			return nodes;
		})
		.catch((err) => {
			console.error(err);
			throw err;
		});
		;
	}

	// 4
	return fetchQuery(environment, query, variables)
	.toPromise()
	.then(async (res) => {
		const key = Object.keys(res)[0];
		const connection = res[key];
		// console.log('connection', connection)
		const {edges = []} = connection;
		const nodes = edges.map(({cursor, node}) => {
			node = convertMutations(node);
			if (node.id) {
				return {data: node, id: node.id, cursor};
			} else {
				return node;
			}
		});
		// console.log("onCompleted nodes", nodes);
		return nodes;
	})
	.catch((err) => {
		console.error(err);
		throw err;
	});
};
