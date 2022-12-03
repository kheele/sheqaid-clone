import React from "react";
import {isObservable, isObservableArray, isObservableMap, isObservableObject, toJS} from 'mobx';

import WebWorker from "../web-worker/WebWorker";

import {execWhen} from '../utils/Utils';

const worker = new WebWorker();

class Firestore {

    constructor() {

    }

    async start() {
//        controllers.run(worker);
    }
}

function toArray(args) {
    var array = [];
    for (var n in args) {
        array.push(args[n]);
    }
    return array;
}

// <editor-fold defaultstate="collapsed" desc="window.firebaseBinding. Click on the + sign on the left to edit the code.">
window.firebaseBinding = {
    events: {
        emit: function () {
            const args = toArray(arguments);
            const evt = args.removeFirst();
            return new Promise((resolve, reject) => {
                const send = (evt, args) => {
                    const convert = (arg) => {
                        if (isObservable(arg)) {
                            return toJS(arg);
                        } else if (isObservableArray(arg)) {
                            return convert(toJS(arg));
                        } else if (isObservableObject(arg)) {
                            return convert(toJS(arg));
                        } else if (isObservableMap(arg)) {
                            return convert(toJS(arg));
                        } else if (isArray(arg)) {
                            return arg.map(convert);
                        }
                        return arg;
                    };
                    const argsFinal = args.map(convert);

                    worker.emit.apply(worker, [evt, ...argsFinal]).then(res => {
                        clearTimeout(to);
                        resolve(res);
//                    console.log('res', res)
                    }).catch(mainErr => {
                        clearTimeout(to);
                        reject(mainErr);
                        console.error(evt, mainErr);
                        execWhen(() => !!window.infoDialog).then(() => {
                            if (!mainErr) {
                                infoDialog.open('An error occurred. Please try again.');
                                return;
                            }
                            if (mainErr.toString().startsWith('Error: CONN_ERR')) {
                                infoDialog.open(<p>Internet connection is unavailable.<br/><br/>Please connect and try again.</p>);
                            } else if (mainErr.toString().startsWith('Error: AUTH-NETWORK-ERROR')) {
                                infoDialog.open(<p>Auhentication failed due to internet connection.<br/><br/>Please connect and try again.</p>);
                            } else {
                                const err = mainErr.toString();
                                if (err.contains("Loading") && err.endsWith("failed.")) {
                                    infoDialog.action("Try Again", () => {
                
                                    }).open(<p>Failed to complete an action due to network failure.<br/><br/>Please connect and try again.</p>);
                                } else {
                                    console.log('fs', mainErr.message, mainErr.stack, mainErr.componentStack)
                                    if (!mainErr.message && !mainErr.stack && !mainErr.componentStack) {

                                    } else {
                                        infoDialog.action("Report Problem", () => {
                                            const data = {message: mainErr.message || "", stack: mainErr.stack || "", error_info: mainErr.componentStack || ""};

                                            neonBinding.events.emit("error-reporting/create", data).then(res => {
                                                infoDialog.open(<React.Fragment>
                                                <p>Problem successfully reported!</p> 
                                                <p>We will fix it as soon as possible.</p>    
                                            </React.Fragment>);
                                                infoDialog.close(5000);
                                            });
                                        }).open(<p>An error occurred.<br/><br/>Please try again.</p>);
                                    }
                                }
                            }
                        });
                    });
                };
                
                const to = setTimeout(() => {
                    execWhen(() => !!window.infoDialog).then(() => {
                        infoDialog.action("Try Again", () => {
                            send(evt, args);
                        }).open('The request took too long.');
//                        infoDialog.open('The request took too long.');
                    });
                    //reject(new Error('(' + evt + ')' + ' The request took too long'));
                }, 200000);
                
                send(evt, args);
            });
        },
        on: (evt, fn) => {
            const promise = async data => {
                return await fn(data);
            };
            worker.on(evt, promise);
            return promise;
        },
        off: (evt, promise) => {
            worker.off(evt, promise);
        }
    }
};

window.neonBinding = firebaseBinding;
// </editor-fold>

const db = new Firestore();
export default db;
