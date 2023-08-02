import React from "react";
import {execWhen} from './Utils';

const checkUsernameInDB = (path, val, isContractorUser) => {
    return neonBinding.events.emit(`${path}find_by/username`, val).then(res => {
        console.log("checkUsernameInDB res", res)
        if (res === 'NO_USER_DB')
            return res;
        if (res) {
            if (isContractorUser && res.contractor) {
                return res;
            }
            return 'DB_USER_DUP';
        }
    });
};

const checkUsernameInAuth = async (path, val) => {
    return neonBinding.events.emit(`${path}check/auth/username`, val).then(uid => {
        console.log("checkUsernameInAuth res", uid)
        return uid;
    });
};

function onChangeUsername(path, onBtnRef) {
    return function (el, val) {
        const {usernameStatus} = this.state;
        usernameStatus.username = val;
        execWhen(() => onBtnRef ? onBtnRef() : true).then(btnRef => {
            !isBoolean(btnRef) && btnRef.disabled();

            usernameStatus.loading = false;
            usernameStatus.required = false;
            usernameStatus.duplicate = false;
            usernameStatus.exist = false;

            if (val && !val.isEmpty()) {
                usernameStatus.valid = val.isEmailAddress();
                if (usernameStatus.valid) {
                    usernameStatus.loading = true;

                    const isContractorUser = path.contains('contractors/users/');

                    const checkUsernameInAuthLocal = () => {
                        checkUsernameInAuth(path, val).then(uid => {
                            usernameStatus.exist = !!uid;
                            usernameStatus.loading = false;
                            if (usernameStatus.exist) {
                                // password && password.hide();
                                // conf_password && conf_password.hide();
                            } else {
                                !isBoolean(btnRef) && btnRef.enabled();
                                // password && password.show();
                                // conf_password && conf_password.show();
                            }
                        });
                    };

                    checkUsernameInDB(path, val, isContractorUser).then(res => {
                        if (isContractorUser && res && res.contractor) {
                            const {contractor: {data: {username: contractorUsername}}} = res;
                            if (contractorUsername === val) {
                                checkUsernameInAuthLocal();
                            } else {
                                usernameStatus.loading = false;
                                usernameStatus.duplicate = true;
                            }
                        } else {
                            switch (res) {
                                case 'NO_USER_DB':
                                    checkUsernameInAuthLocal();
                                    break;
                                case 'DB_USER_DUP':
                                    usernameStatus.loading = false;
                                    usernameStatus.duplicate = true;
                                    // password && password.hide();
                                    // conf_password && conf_password.hide();
                                    break;
                                default:
                                    usernameStatus.loading = false;
                                    break;
                            }
                        }
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

const onConfirmUsername = async (path, username) => {
    return neonBinding.events.emit(path + "check/username", username).then(res => {
        console.log("res", res)
        switch (res) {
            case 'EMAIL_DUP':
//                infoDialog.open("User with this email address already exist.");
                break;
            case 'EMAIL_DUP':
                break;
            default:
                break;
        }
    }).finally(() => {

    });
};

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
        } else if (res === 'NO_USER_AUTH') {
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

function onSendOTPContractor(uid) {
    progressDialog.open();

    return neonBinding.events.emit(`plugin_sheq_assist/contractors/email/otp`, uid).then(res => {
        console.log("onSendOTPContractor res", res)
        if (!res) {
            infoDialog.open(<div>
                Sorry, we couldn't sending you One-Time Password at the moment.<br/>
                Please try again later.<br/>
                If the issue persists, please contact support.
            </div>);
        } else if (res === 'NO_USER_DB') {
            infoDialog.open(<div>
                Sorry, the contractor associated with this<br/>
                <b>Email Address</b> or <b>Phone Number</b> does not exist.<br/><br/>
                The user could have been deleted from the system.
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

function onConfirmUserOTP(data) {
    progressDialog.open();

    return neonBinding.events.emit(`users/accounts/confirm/otp`, data).then(res => {
        console.log("onSendOTPUser res", res)
        if (isString(res)) {
            switch (res) {
                case 'NO_USER_AUTH':
                    infoDialog.open(<div>
                        Sorry, the user associated with this<br/>
                        <b>Email Address</b> or <b>Phone Number</b> does not exist.
                    </div>);
                    break;
                case 'NO_USER_DB':
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
            return res;//{uid, token}
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

}

export {onChangeUsername, onConfirmUsername, onSendOTPContractor, onSendUserOTP, onConfirmUserOTP, onConfirmContractorOTP};
