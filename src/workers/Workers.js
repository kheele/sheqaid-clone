import React from "react";
import { toJS, isObservable, isObservableArray, isObservableObject, isObservableMap } from "mobx";

import WebWorker from "web-worker/WebWorker";

import { execWhen } from "utils/Utils";

const worker = new WebWorker();

function toArray(args) {
  const array = [];
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const n in args) {
    array.push(args[n]);
  }
  return array;
}

// <editor-fold defaultstate="collapsed" desc="window.workers. Click on the + sign on the left to edit the code.">
const workers = {
  emit() {
    // eslint-disable-next-line prefer-rest-params
    const args = toArray(arguments);
    const evt = args.removeFirst();
    return new Promise((resolve, reject) => {
      const to = setTimeout(() => {
        execWhen(() => !!window.infoDialog).then(() => {
          // eslint-disable-next-line no-undef
          infoDialog
            .action("Try Again", () => {
              // eslint-disable-next-line no-use-before-define
              send(evt, args);
            })
            .open("The request took too long.");
          //                        infoDialog.open('The request took too long.');
        });
        // reject(new Error('(' + evt + ')' + ' The request took too long'));
      }, 200000);

      // eslint-disable-next-line no-shadow
      const send = (evt, args) => {
        const convert = (arg) => {
          if (isObservable(arg)) {
            return toJS(arg);
          }
          if (isObservableArray(arg)) {
            return convert(toJS(arg));
          }
          if (isObservableObject(arg)) {
            return convert(toJS(arg));
          }
          if (isObservableMap(arg)) {
            return convert(toJS(arg));
          }
          if (isArray(arg)) {
            return arg.map(convert);
          }
          return arg;
        };
        const argsFinal = args.map(convert);

        worker.emit
          .apply(worker, [evt, ...argsFinal])
          .then((res) => {
            clearTimeout(to);
            resolve(res);
            //                    console.log('res', res)
          })
          .catch((mainErr) => {
            reject(mainErr);
            clearTimeout(to);
            console.error(evt, mainErr);
            execWhen(() => !!window.infoDialog).then(() => {
              if (!mainErr) {
                infoDialog.open("An error occurred. Please try again.");
                return;
              }
              if (mainErr.toString().startsWith("Error: CONN_ERR")) {
                infoDialog.open(
                  <p>
                    Internet connection is unavailable.
                    <br />
                    <br />
                    Please connect and try again.
                  </p>
                );
              } else if (mainErr.toString().startsWith("Error: AUTH-NETWORK-ERROR")) {
                infoDialog.open(
                  <p>
                    Auhentication failed due to internet connection.
                    <br />
                    <br />
                    Please connect and try again.
                  </p>
                );
              } else {
                const err = mainErr.toString();
                if (err.contains("Loading") && err.endsWith("failed.")) {
                  infoDialog
                    .action("Try Again", () => {})
                    .open(
                      <p>
                        Failed to complete an action due to network failure.
                        <br />
                        <br />
                        Please connect and try again.
                      </p>
                    );
                } else {
                  console.log("fs", mainErr.message, mainErr.stack, mainErr.componentStack);
                  // eslint-disable-next-line no-empty
                  if (!mainErr.stack && !mainErr.componentStack) {
                  } else {
                    infoDialog
                      .action("Report Problem", () => {
                        const data = {
                          message: mainErr.message || "",
                          stack: mainErr.stack || "",
                          error_info: mainErr.componentStack || "",
                        };

                        workers.emit("error-reporting/create", data).then(() => {
                          infoDialog.open(
                            <>
                              <p>Problem successfully reported!</p>
                              <p>We will fix it as soon as possible.</p>
                            </>
                          );
                          infoDialog.close(5000);
                        });
                      })
                      .open(
                        <p>
                          An error occurred.
                          <br />
                          <br />
                          Please try again.
                        </p>
                      );
                  }
                }
              }
            });
          });
      };

      send(evt, args);
    });
  },
  on: (evt, fn) => {
    // eslint-disable-next-line no-return-await
    const promise = async (data) => await fn(data);
    worker.on(evt, promise);
    return promise;
  },
  off: (evt, promise) => {
    worker.off(evt, promise);
  },
};
// </editor-fold>

window.firebaseBinding  = {
    events: workers
};
window.neonBinding = window.firebaseBinding;

export default workers;
