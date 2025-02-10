/* eslint-disable camelcase */

// 1
import {commitMutation} from "react-relay";
import environment from "Environment";
import {convertMobx} from "../utils/Utils";
import {convertMutations} from "./convertMutations";

// 2
export default async ({checkLogin = true, mutation, input, optimisticUpdater, updater}) =>
	new Promise(async (resolve, reject) => {
		const {is} = storage;
		if (checkLogin) {
			// return;//TODO: Uncomment. it was commented for data transfer
			if (!is.isLoggedInAuth && !is.isNewContractorUserOTPStatusVerified) {
				return Promise.reject(new Error(`Unauthorized request => mutation: ${JSON.stringify(mutation)}`));
			}
		}

		// 4
		const variables = {
			object: await convertMobx(input),
		};

		console.log('createMutationImpl input object', variables.object);

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
				// const storyRecord = proxyStore.get(storyID);
				// const connectionRecord = ConnectionHandler.getConnection(
				//   storyRecord,
				//   "StoryComponent_story_comments_connection"
				// );
				//
				// // Get the payload returned from the server
				// const payload = proxyStore.getRootField("comment_create");
				//
				// // Get the edge inside the payload
				// const serverEdge = payload.getLinkedRecord("comment_edge");
				//
				// // Build edge for adding to the connection
				// const newEdge = ConnectionHandler.buildConnectionEdge(proxyStore, connectionRecord, serverEdge);
				//
				// ////////
				//
				//   const payload = proxyStore.getRootField('addComment');
				//   const newComment = payload.getLinkedRecord('comment');
				//   if (!newComment) {
				//       return;
				//   }
				//   const post = proxyStore.get(variables.input.post);
				//   const connection = ConnectionHandler.getConnection(post, 'Single_post_comments', {
				//       post: variables.input.post,
				//   });
				//   const newEdge = ConnectionHandler.createEdge(proxyStore, connection, newComment, 'CommentEdge');
				//   ConnectionHandler.insertEdgeAfter(connection, newEdge);
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
				// console.error(err);
			},
		});
	});
