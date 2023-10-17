// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../utils/Form';

import {ClearableInput, ProfileField} from '../inputs';
import {Row} from '../FormComponents';

import AEditDialog from './AEditDialog';
import ALoginControls from './ALoginControls';

import style from './SetupEmailPasswordDialog.lazy.css';
import storage from "../../storage/Storage";
import {execWhen} from "../../utils/UtilsFuns";
import updateEmployee from "../../mutations/all/Employee/updateEmployee";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class SetupEmailPasswordDialog extends AEditDialog {
    pageKey = "SetupEmailPasswordDialog";
    className = "AAuthDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Setup Password";
    }

    get topButtons() {
        return null;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends ALoginControls {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable state = {};
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    componentWillUnmount() {
        this.authListener && this.authListener();
    }

    // <editor-fold defaultstate="collapsed" desc="onNext">
    async onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 2) {
            if (!form.isValid('password')) {
                infoDialog.open('Password is required');
                return;
            }
            if (!form.isValid('password_conf')) {
                infoDialog.open('Confirmation Password is required');
                return;
            }
            if (form.get('password') !== form.get('password_conf')) {
                infoDialog.open('Passwords do not match');
                return;
            }

            const res = await this.onSubmit(e, btn);
            if (!res) {
                return false;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn) {
        const {form} = this;
        const {code, password} = form.data;
        const {auth} = this;
        const {id, username, type} = this.item;

        alert(id);

        progressDialog.open();

        return auth.createUserWithEmailAndPassword(username, password).then(newUserCredential => {
            if (!newUserCredential || !newUserCredential.user) {
                infoDialog.open();
                return false;
            }

            const {user} = newUserCredential;
            return updateEmployee({id, auth_id: user.uid}).then(() => {
                return user.sendEmailVerification().then(() => {
                    this.props.onFormGotoNext();

                    const authenticate = () => {
                        this.authListener = auth.onAuthStateChanged((user) => {
                            if (user) {
                                const {emailVerified} = user;
                                if (emailVerified) {
                                    this.authListener();

                                    infoDialog.open(<p>
                                        Password successfully set up.<br />
                                        Please verify your email address and you will automatically be logged in.
                                    </p>);

                                    const data = {username, password};
                                    user.getIdToken(true).then(token => {
                                        return workers.emit(this.path + "login-auto", token).then(res => {
                                            console.log(this.path + "login res", res);
                                            if (!res) return res;

                                            this.auth.onAuthStateChanged(currentUser => {
                                                storage.onLogin(currentUser);
                                            });

                                            return execWhen(() => storage.loggedUserAuth).
                                            then(loggedUserAuth => loggedUserAuth.getIdTokenResult().
                                            then(idTokenResult => {
                                                storage.idTokenResult = idTokenResult;
                                                return res;
                                            }));
                                        });
                                    }).then(res => {
                                        console.log("res", res)

                                        const {dialog} = this.props;
                                        dialog.close();

                                        this.onComplete(res, true, type);
                                    }).catch(err => {
                                        console.error(err);
                                        infoDialog.open(<div>
                                            Sorry, we couldn't verify you at the moment.<br/>
                                            Please make sure you have internet connection and try again.<br/>
                                            If the issue persists, please contact support.
                                        </div>);
                                    });
                                } else {
                                    user.getIdToken(true).then(token => {
                                        return auth.signInWithEmailAndPassword(username, password);
                                    }).finally(() => {
                                        this.authListener();
                                        setTimeout(authenticate);
                                    });

                                }
                            }
                        });
                    };

                    authenticate();

                    return true;
                });
            });
        }).catch(err => {
            this.props.onFormGotoPrev();
            console.error(err);
            switch (err.code) {
                case 'auth/network-request-failed':
                    infoDialog.open(<div>Your internet connection is too slow<br/>or you are not connected to the
                        internet.</div>);
                    break;
                case 'auth/quota-exceeded':
                case 'auth/internal-error':
                default:
                    infoDialog.open(<div>Sorry, we couldn't set up your password at the moment.<br/>Please try again
                        later.<br/>If the issue persists, please contact support.</div>);
                    break;
            }
            return false;
        }).finally(() => {
            progressDialog.close();
        });
    }

    // </editor-fold>

    get auth() {
        const {type} = this.item;
        if (type === "Contractor") {
            return auth2;
        } else if (type === "Staff") {
            return auth_hr;
        } else {
            return auth;
        }
    }

    get path() {
        if (isAdminApp) {
            return "admin/users/accounts/";
        }
        const {type} = this.item;
        if (type === "Contractor") {
            return "plugin_sheq_assist/contractors/users/";
        } else if (type === "Staff") {
            return "plugin_sheq_assist/employees/accounts/";
        } else {
            return "users/accounts/";
        }
    }

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) return null;

        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
            },
            item: {id, username, type}
        } = this;

        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row
                    rendered
                    active
                    idx={1}
                    title="1. Email Address"
                    sectionClassName="w-full"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                >
                    <ProfileField title="Email Address" name="username" value={username} className="col-lg-12"/>
                    {!isAdminApp &&
                        <ProfileField title="Access Type" name="access_type" value={type} className="col-lg-12"/>}
                </Row>
                <Row
                    rendered
                    idx={2}
                    title="2. New Password"
                    sectionClassName="w-full"
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <ClearableInput name="password" type="password" placeholder="Password" className="form-control"
                                    onChange={this.form.onChange}/>
                    <ClearableInput name="password_conf" type="password" placeholder="Confirmation Password"
                                    className="form-control" onChange={this.form.onChange}/>
                </Row>
                <Row
                    rendered
                    idx={3}
                    title="3. Email Verification"
                    sectionClassName="font-size-14"
                    onFormBack={onFormBack}
                >
                    <p className="text-center padding-10 font-size-14 bg-eee font-weight-bold margin-t-5 margin-r-10 margin-b-10">
                        Verification link sent to your email.
                    </p>
                    1. Please check your email to verify your account.<br/>
                    2. You will be automatically be logged in after verifying your email.
                </Row>
            </div>
        </div>);
    }

    // </editor-fold>
}

export default SetupEmailPasswordDialog;
