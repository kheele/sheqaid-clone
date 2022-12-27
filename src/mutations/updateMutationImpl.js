/* eslint-disable camelcase */

// 1
import { commitMutation } from "react-relay";
import environment from "Environment";

// 2
export default ({ mutation, id, attrs, optimisticUpdater, updater }) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line no-unused-vars
    const { is } = storage;
    if (!is.isLoggedInAuth) {
      return;
    }

    delete attrs.id;

    // 4
    const variables = {
      id: { id },
      _set: attrs,
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
      onCompleted: (res, err) => {
        if (err) return reject(err);
        const key = Object.keys(res)[0];
        // console.log("onCompleted", res, key, res[key]);
        return resolve(res[key]);
      },
      onError: (err) => {
        reject(err);
        console.error(err);
      },
    });
  });
