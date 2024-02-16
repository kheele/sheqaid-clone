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
		if (checkLogin) {
			// return;//TODO: Uncomment. it was commented for data transfer
			if (!is.isLoggedInAuth && !is.isNewContractorUserOTPStatusVerified) {
				return Promise.reject(new Error(`Unauthorized request => mutation: ${JSON.stringify(mutation)}`));
			}
		}

		// 4
		const variables = {};
		if(attrs) {
			delete attrs.id;
			variables.id = {id};
			variables._set = await convertMobx(attrs);
		} else {
			variables.id = {id};
		}

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
