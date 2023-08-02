/* eslint-disable camelcase */

// 1
import { commitMutation } from "react-relay";
import environment from "Environment";

// 2
export default async ({ mutation, id, optimisticUpdater, updater }) => {
  progressDialog.open();

  // eslint-disable-next-line no-unused-vars
  const { is } = storage;
  if (!is.isLoggedInAuth) {
    progressDialog.close();
    return Promise.reject(new Error("You must be logged in"));
  }

  // 4
  const variables = {
    id: { id },
    _set: { is_removed: true },
  };

  return new Promise((resolve, reject) => {
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
        progressDialog.close();
        if (err) {
          infoDialog.open("An error occurred. Please try again.");
          reject(err);
          return;
        }

        const key = Object.keys(res)[0];
        let node = res[key];
        if(!node) {
          infoDialog.open("An error occurred. Please try again.");
          return;
        }

        infoDialog.open("Record successfully removed.");

        if(node.id) {
          const id = convertIdToBigint(node.id);
          const data = {...node, id};
          node = {data, id};
        }
        // console.log("onCompleted", res, key, node);
        resolve(node);
      },
      onError: (err) => {
        progressDialog.close();
        infoDialog.open("An error occurred. Please try again.");
        console.error(err);
        reject(err);
      },
    });
  });
};
