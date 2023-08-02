// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {Clickable} from '../inputs';
import {execWhen} from "../../utils/Utils";

// </editor-fold>

@observer
class ALoginControls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

//                firebase.auth().currentUser.unlink(firebase.auth.PhoneAuthProvider.PROVIDER_ID);
        if (this.onSetupBiometric) {
            this.onSetupBiometric = this.onSetupBiometric.bind(this);
        }
        this.onComplete = this.onComplete.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSetupBiometric">
    async onSetupBiometric(e, btn) {
        let {loggedUser} = btn.props;
        const {dialog} = this.props;
        infoDialog.close();

        if (!loggedUser) {
            progressDialog.open();
            const {form} = this;
            const {username, type} = form.data;
            const user = await neonBinding.events.emit(this.path + "find_by/username", username).then(res => {
                console.log("res", res)
                progressDialog.close();
                return res;
            }).catch(err => {
                progressDialog.close();
                console.error(err);

                infoDialog.open(<div>
                    Sorry, we couldn't verify you at the moment.<br/>
                    Please make sure you have internet connection and try again.<br/>
                    If the issue persists, please contact support.
                </div>);
            });
            if (!user) {
                return;
            }
            loggedUser = {user, access_type: type === 'Contractor' ? 'ContractorUser' : type};
        }
        this.refs.setupFaceDialog.open(loggedUser).then(() => {
            dialog.close();
        });
    }

    // </editor-fold>

    isFailure(res) {
        if (isString(res)) {
            switch (res) {
                case "auth/too-many-requests":
                case "auth/network-request-failed":
                case "NO_USER_AUTH":
                case "NO_USER_DB":
                case "SETUP_BIOMETRIC":
                case "NO_BIOMETRIC_PERMISSION":
                case "NO_DETECTION":
                case "UNKNOWN_DETECTION":
                case "ERR_LOAD_MODELS":
                case "ERR_CREATING_TOKEN":
                    return true;
                default:

            }
        }
        return false;
    }

    async onFailed(res) {
        if (!res) {
            infoDialog.open("Authentication failed.");
        } else if (isString(res)) {
            switch (res) {
                case "auth/too-many-requests":
                    infoDialog.open(<div>
                        Access to this account has been<br/>
                        temporarily disabled due to many<br/>
                        failed login attempts.<br/><br/>
                        You can immediately restore it by<br/>
                        resetting your password or you<br/>
                        can try again later.
                    </div>);
                    break;
                case "auth/network-request-failed":
                    infoDialog.open(<div className="text-left">
                        1. You currently do not have internet access or;<br/>
                        2. Your internet connection is too slow<br/><br/>
                        Please try again when you have stronger connection.
                    </div>);
                    break;
                case "NO_USER_AUTH":
                    infoDialog.open(<div>
                        Sorry, the user associated with this<br/>
                        <b>Email Address</b> or <b>Phone Number</b> does not exist.
                    </div>);
                    break;
                case "NO_USER_DB":
                    infoDialog.open(<div>
                        Sorry, the user associated with this<br/>
                        <b>Email Address</b> or <b>Phone Number</b> does not exist.<br/><br/>
                        The user could have been deleted from the system.
                    </div>);
                    break;
                // case "SETUP_BIOMETRIC":
                //     onSetupBiometric(null, null, false);
                //     break;
                case "NO_BIOMETRIC_PERMISSION":
                    infoDialog.open(<div>
                        Sorry, the user associated with this<br/>
                        <b>Email Address</b> or <b>Phone Number</b> does not have<br/>
                        permission to authenticate using biometric.<br/><br/>
                        Please contact your administrator to give you permission to authenticate using biometric.
                    </div>);
                    break;
                case "NO_DETECTION":
                    infoDialog.open(<div>
                        Sorry, the user associated with this<br/>
                        <b>Email Address</b> or <b>Phone Number</b> does not have a valid biometric.<br/><br/>
                    </div>);
                    break;
                case "UNKNOWN_DETECTION":
                    infoDialog.open(<div>
                        Sorry, the user associated with this<br/>
                        <b>Email Address</b> or <b>Phone Number</b> couldn't be verified.<br/><br/>
                    </div>);
                    break;
                case "ERR_LOAD_MODELS":
                case "ERR_CREATING_TOKEN":
                default:
                    infoDialog.open(<div>
                        Sorry, we couldn't verify you at the moment.<br/>
                        Please try again later.<br/>
                        If the issue persists, please contact support.
                    </div>);
                    break;
            }
        }
    }

    async onComplete(res, isMultiFactor = false, type) {
        console.log('onComplete', res, isMultiFactor)

        const onSetupBiometric = (loggedUser, alreadySetup = true) => {
            infoDialog.open(<div>
                You are required to <b>only login</b> using <b>Biometric Authentication</b>.<br/>
                {alreadySetup && <p className="margin-t-10">
                    Please login using <b>
                    <Clickable loggedUser={loggedUser} onClick={this.onSwitchToBiometric}>
                        <a href="#">Biometric Authentication</a>
                    </Clickable>
                </b>
                </p>}
                {!alreadySetup && <p className="margin-t-10">
                    You have currently not yet setup the <b>Biometric Authentication</b>
                </p>}
                {!alreadySetup && <p className="margin-t-10">
                    Please setup your <b>
                    <Clickable loggedUser={loggedUser} onClick={this.onSetupBiometric}>
                        <a href="#">Biometric Authentication</a>
                    </Clickable>
                </b>
                </p>}
            </div>);
        };

        if (!res) {
            infoDialog.open("Authentication failed.");
        } else if (isString(res)) {
            this.onFailed(res);
        } else if (isObject(res)) {
            // setTimeout(async () => {
                const {loggedUserAuth} = storage;
                console.log('onComplete loggedUserAuth', loggedUserAuth)

                if (!loggedUserAuth && type) {
                    const {token} = res;
                    const __auth = type === "Contractor" ? auth2 : auth;
                    await __auth.signInWithCustomToken(token).then(async userCredential => {
                        if (!userCredential)
                            return false;
                        const {user} = userCredential;

                        storage.loggedUserAuth = user;
                    })
                }

                const currentUser = storage.loggedUserAuth;

                if (currentUser) {
                    const {loggedUser} = res;
                    const {user: {data: {auth_type = "MultiFactor", has_biometric}}} = loggedUser;
                    if (isMultiFactor && auth_type === "Biometric") {
                        storage.login.currAuth.signOut().then(() => {
                            onSetupBiometric(loggedUser, !!has_biometric);
                        });
                    } else {
                        const {dialog} = this.props;
                        if (isMultiFactor) {
                            const {phoneNumber} = currentUser;
                            if (!phoneNumber) {
                                this.refs.setupPhoneNumDialog.open(loggedUser).then(() => {
                                    dialog.close();
                                });
                            } else {
                                this.refs.verifyPhoneNumDialog.open(loggedUser).then(() => {
                                    dialog.close();
                                });
                            }
                        } else {
                            storage.login.loginUser(loggedUser);
                            dialog.close();
                        }
                    }
                } else {
                    infoDialog.open("Authentication failed.");
                }
            // }, 5000);
        }
    }

}

export default ALoginControls;