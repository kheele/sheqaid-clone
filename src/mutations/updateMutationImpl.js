/* eslint-disable camelcase */

// 1
import {commitMutation} from "react-relay";
import environment from "Environment";
import {convertMobx} from "../utils/Utils";
import {convertMutations} from "./convertMutations";

// 2
export default async ({checkLogin = true, mutation, id, attrs, optimisticUpdater, updater}) =>
	new Promise(async (resolve, reject) => {
		// eslint-disable-next-line no-unused-vars
		const {is} = storage;
		if (checkLogin && !is.isLoggedInAuth) {
			// return;
		}

		delete attrs.id;

		// 4
		const variables = {
			id: {id},
			_set: await convertMobx(attrs),
		};

		// 5
		commitMutation(environment, {
			mutation,
			variables,
			// 6
			optimisticUpdater: (proxyStore) => {
				if (optimisticUpdater) {
					optimisticUpdater(proxyStore);
				}
			},
			updater: (proxyStore) => {
				if (updater) {
					updater(proxyStore);
				}
			},
			onCompleted: async (res, err) => {
				if (err) return reject(err);

				const key = Object.keys(res)[0];
				let node = convertMutations(res[key]);
				if (node && node.id) {
					node = {data: node, id: node.id};
				}
				console.log("onCompleted", res, key, node);
				resolve(node);
			},
			onError: (err) => {
				reject(err);
				console.error(err);
			},
		});
	});
