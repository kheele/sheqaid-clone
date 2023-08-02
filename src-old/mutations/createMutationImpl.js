/* eslint-disable camelcase */

// 1
import { commitMutation } from "react-relay";
import environment from "Environment";

// 2
export default ({ checkLogin = true, mutation, input, optimisticUpdater, updater }) =>
  new Promise((resolve, reject) => {
    const { is } = storage;
    if (checkLogin && !is.isLoggedInAuth) {
      return;
    }

    // 4
    const variables = {
      object: input,
    };

    console.log('createMutationImpl input', input);

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
      onCompleted: (res, err) => {
        if (err) return reject(err);
        const key = Object.keys(res)[0];
        let node = res[key];
        if(node && node.id) {
            const id = convertIdToBigint(node.id);
            const data = {...node, id};
            node = {data, id};
        }
        // console.log("onCompleted", res, key, node);
        return resolve(node);
      },
      onError: (err) => {
        reject(err);
        // console.error(err);
      },
    });
  });
