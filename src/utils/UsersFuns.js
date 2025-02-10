import React from "react";
import {execWhen} from './Utils';
import {sendOTPContractor} from "mutations/update";
import {checkExistByUsername, findByOTPContractor} from "mutations/findBy";

//done
function onChangeUsername(access_type, onBtnRef) {
    return function (el, username) {
        const {usernameStatus} = this.state;
        usernameStatus.username = username;
        execWhen(() => onBtnRef ? onBtnRef() : true).then(btnRef => {
            !isBoolean(btnRef) && btnRef.disabled();

            usernameStatus.loading = false;
            usernameStatus.required = false;
            usernameStatus.duplicate = false;
            usernameStatus.exist = false;

            if (username && !username.isEmpty()) {
                usernameStatus.valid = username.isEmailAddress();
                if (usernameStatus.valid) {
                    usernameStatus.loading = true;

                    checkExistByUsername({username, access_type}).then(res => {
                        if (!res) {
                            usernameStatus.loading = false;
                            return;
                        }

                        if ("uid" in res) {
                            usernameStatus.exist = !!res.uid;
                            usernameStatus.loading = false;
                            if (usernameStatus.exist) {
                                // password && password.hide();
                                // conf_password && conf_password.hide();
                            } else {
                                !isBoolean(btnRef) && btnRef.enabled();
                                // password && password.show();
                                // conf_password && conf_password.show();
                            }
                            return;
                        }

                        if (res === "DB_USER_DUP") {
                            usernameStatus.loading = false;
                            usernameStatus.duplicate = true;
                            // password && password.hide();
                            // conf_password && conf_password.hide();
                            return;
                        }

                        usernameStatus.loading = false;
                    });
                } else {
                    // password && password.hide();
                    // conf_password && conf_password.hide();
                }
            } else {
                // password && password.hide();
                // conf_password && conf_password.hide();
                usernameStatus.required = true;
                usernameStatus.valid = false;
            }
        });
    }.bind(this);
}

//working on it
function onSendUserOTP(username) {
    progressDialog.open();

    return neonBinding.events.emit(`users/accounts/email/otp`, username).then(res => {
        console.log("onSendOTPUser res", res)
        if (!res) {
            infoDialog.open(<div>
                Sorry, we couldn't sending you One-Time Password at the moment.<br/>
                Please try again later.<br/>
                If the issue persists, please contact support.
            </div>);
        } else if (res === 'NO_USER_DB' || res === 'NO_USER_AUTH') {
            infoDialog.open(<div>
                Sorry, the user associated with this<br/>
                <b>Email Address</b> or <b>Phone Number</b> does not exist.
            </div>);
        } else {
            return true;
        }
    }).catch(err => {
        infoDialog.open(<div>
            Sorry, we couldn't send you One-Time Password at the moment.<br/>
            Please try again later.<br/>
            If the issue persists, please contact support.
        </div>);
    }).finally(() => {
        setTimeout(() => progressDialog.close());
    });
}

//working on it
function onSendOTPContractor(id) {
    progressDialog.open();

    return sendOTPContractor(id).then(res => {
        console.log("onSendOTPContractor res", res)
        if (!res) {
            infoDialog.open(<div>
                Sorry, we couldn't sending you One-Time Password at the moment.<br/>
                Please try again later.<br/>
                If the issue persists, please contact support.
            </div>);
        } else if (res === 'NO_USER_DB' || res === 'NO_USER_AUTH') {
            infoDialog.open(<div>
                Sorry, the contractor associated with this<br/>
                <b>Email Address</b> or <b>Phone Number</b> does not exist.<br/><br/>
                The user could have been deleted from the system.
            </div>);
        } else {
            return true;
        }
    }).catch(err => {
        console.error(err)
        infoDialog.open(<div>
            Sorry, we couldn't send you One-Time Password at the moment.<br/>
            Please try again later.<br/>
            If the issue persists, please contact support.
        </div>);
    }).finally(() => {
        setTimeout(() => progressDialog.close());
    });
}

//working on it
function onConfirmUserOTP(data) {
    progressDialog.open();

    return neonBinding.events.emit(`users/accounts/confirm/otp`, data).then(res => {
        console.log("onSendOTPUser res", res)
        if (isString(res)) {
            switch (res) {
                case 'NO_USER_DB':
                case 'NO_USER_AUTH':
                    infoDialog.open(<div>
                        Sorry, the user associated with this<br/>
                        <b>Email Address</b> or <b>Phone Number</b> does not exist.
                    </div>);
                    break;
                case 'NO_OTP_DB':
                    infoDialog.open(<div>
                        Sorry, the user associated with this<br/>
                        <b>Email Address</b> or <b>Phone Number</b> does not exist.<br/><br/>
                        The user could have been deleted from the system.
                    </div>);
                    break;
                case 'NO_OTP_MATCH':
                    infoDialog.open(<div>
                        Your One-Time Password does not match.<br/>
                        Please try again
                    </div>);
                    break;
                case 'CODE_EXPIRED':
                    infoDialog.open(<div>
                        Your One-Time Password has expired.<br/>
                        Please try again
                    </div>);
                    break;
                case 'ERR_UPDATE_USER':
                    infoDialog.open(<div>
                        Sorry, we couldn't verify your One-Time Password at the moment.<br/>
                        Please try again later.<br/>
                        If the issue persists, please contact support.
                    </div>);
                    break;
                case 'ERR_CREATING_TOKEN':
                    infoDialog.open(<div>
                        Sorry, we couldn't verify your One-Time Password at the moment.<br/>
                        Please try again later.<br/>
                        If the issue persists, please contact support.
                    </div>);
                    break;
                default:
                    infoDialog.open(<div>
                        Sorry, we couldn't verify your One-Time Password at the moment.<br/>
                        Please try again later.<br/>
                        If the issue persists, please contact support.
                    </div>);
                    break;
            }
        } else if (res && res.uid) {
            return res;//{uid, customToken}
        } else {
            infoDialog.open(<div>
                Sorry, we couldn't verify your One-Time Password at the moment.<br/>
                Please try again later.<br/>
                If the issue persists, please contact support.
            </div>);
        }
    }).catch(err => {
        infoDialog.open(<div>
            Sorry, we couldn't verify your One-Time Password at the moment.<br/>
            Please try again later.<br/>
            If the issue persists, please contact support.
        </div>);
    }).finally(() => {
        setTimeout(() => progressDialog.close());
    });
}

function onConfirmContractorOTP(data) {
    progressDialog.open();

    return findByOTPContractor(data).then(res => {
        console.log("findByOTPContractor res", res)

        if (isString(res)) {
            switch (res) {
                case 'NO_USER_DB':
                case 'NO_USER_AUTH':
                    infoDialog.open(<div>
                        Sorry, the user associated with this<br/>
                        <b>Email Address</b> or <b>Phone Number</b> does not exist.<br/><br/>
                        The user could have been deleted from the system.
                    </div>);
                    break;
                case 'NO_OTP_MATCH':
                    infoDialog.open(<div>
                        Your One-Time Password does not match.<br/>
                        Please try again
                    </div>);
                    break;
                case 'CODE_EXPIRED':
                    infoDialog.open(<div>
                        Your One-Time Password has expired.<br/>
                        Please try again
                    </div>);
                    break;
                default:
                    infoDialog.open(<div>
                        Sorry, we couldn't verify your One-Time Password at the moment.<br/>
                        Please try again later.<br/>
                        If the issue persists, please contact support.
                    </div>);
                    break;
            }
        } else if (res && res.data) {
            return res;
        }
    }).catch(err => {
        infoDialog.open(<div>
            Sorry, we couldn't verify your One-Time Password at the moment.<br/>
            Please try again later.<br/>
            If the issue persists, please contact support.
        </div>);
    }).finally(() => {
        setTimeout(() => progressDialog.close());
    });
}

export {onChangeUsername, onSendOTPContractor, onSendUserOTP, onConfirmUserOTP, onConfirmContractorOTP};
