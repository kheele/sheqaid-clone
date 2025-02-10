// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import parsePhoneNumber from 'libphonenumber-js';
import {observable} from 'mobx';

import Form from '../../utils/Form';

import {Button, ClearableInput} from '../inputs';
import {Row} from '../FormComponents';

import SetupFaceDialog from './SetupFaceDialog';
import LoginFaceDialog from './LoginFaceDialog';
import SetupPhoneNumDialog from './SetupPhoneNumDialog';
import VerifyPhoneNumDialog from './VerifyPhoneNumDialog';
import SetupEmailPasswordDialog from './SetupEmailPasswordDialog';
import SetupPhonePasswordDialog from './SetupPhonePasswordDialog';
import NewContractorUserDialog from '../../views/default/Users/NewDialog';

import ANewDialog from './ANewDialog';
import ALoginControls from './ALoginControls';

import style from './LoginPasswordDialog.lazy.css';
import storage from "../../storage/Storage";
import {execWhen} from "../../utils/UtilsFuns";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class LoginPasswordDialog extends ANewDialog {
    pageKey = "LoginPasswordDialog";
    className = "AAuthDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Multi-Factor Authentication";
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
    @observable
    state = {
        display: true,
        lists: {
            type: [
                {text: 'User', value: 'User'},
                {text: 'Contractor', value: 'Contractor'},
                {text: 'Staff', value: 'Staff'}
            ]
        },
        uid: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);

        this.onSignUp = this.onSignUp.bind(this);
        this.onForgotPassword = this.onForgotPassword.bind(this);
        this.onSwitchToBiometric = this.onSwitchToBiometric.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    async componentDidMount() {

    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    async onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('username')) {
                infoDialog.open('Email Address / Phone Number is required');
                return;
            }
            const username = form.get('username');
            if (!username.isEmailAddress()) {
                const phoneNumber = parsePhoneNumber(username);
                if (!phoneNumber) {
                    infoDialog.open('Valid Email Address / Phone Number is required');
                    return;
                }
                if (!phoneNumber.isValid()) {
                    infoDialog.open('Valid Email Address / Phone Number is required');
                    return;
                }
            }
            if (!isAdminApp && !form.isValid('type')) {
                infoDialog.open('Please select Login As [User, Contractor or Staff]');
                return false;
            }

            progressDialog.open();

            const {type} = form.data;

            try {
                const res = await neonBinding.events.emit(this.path + "login/username", username);
                progressDialog.close();
                if (!res) {
                    infoDialog.open(<div>
                        Sorry, we couldn't verify you at the moment.<br/>
                        The {type} with this {username.isEmailAddress() ? 'Email Address' : 'Phone Number'} was not
                        found
                    </div>);
                    return false;
                }
                console.log(res)
                if (this.isFailure(res)) {
                    this.onFailed(res);
                    return false;
                }
                const {
                    uid, id,
                    contractor, message//is contractor
                } = res;
                if (type === "Staff") {
                    if (!uid) {
                        const {dialog} = this.props;
                        if (username.isEmailAddress()) {
                            this.refs.setupEmailPasswordDialog.open({id, username, type}).then(() => {
                                dialog.close();
                            });
                        } else {
                            this.refs.setupPhonePasswordDialog.open({id, username, type}).then(() => {
                                dialog.close();
                            });
                        }
                        return false;
                    }
                } else if (type === "Contractor") {
                    if (contractor) {
                        if (message === "CONTRACTOR_EMAIL_RESTRICTION") {
                            infoDialog.open(<div className="text-left">
                                <b>Using this login details is prohibited</b><br/><br/>
                                Please contact <b>{contractor.data.name}</b> system administrator to set up your account
                                if it was not set up;<br/>
                            </div>);
                            return false;
                        }
                        //setup user account
                        this.refs.newContractorUserDialog.open(contractor);
                        return false;
                    }
                }
                this.state.uid = uid;
                return true;
            } catch (err) {
                console.error(err);
                progressDialog.close();
                infoDialog.open(<div>
                    Sorry, we couldn't verify you at the moment.<br/>
                    Please make sure you have internet connection and try again.<br/>
                    If the issue persists, please contact support.
                </div>);
                return false;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSignUp">
    onSignUp(e, btn) {
        const {dialog} = this.props;
        dialog.props.onSignUp(e, btn);
        dialog.close();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onForgotPassword">
    onForgotPassword(e, btn) {
        const {dialog} = this.props;
        dialog.props.onForgotPassword(e, btn);
        dialog.close();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSwitchToBiometric">
    onSwitchToBiometric(e, btn) {
        const {dialog} = this.props;
        infoDialog.close();
        this.refs.loginFaceDialog.open().then(() => {
            dialog.close();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn) {
        const {form} = this;

        if (!form.isValid('password')) {
            infoDialog.open('Password is required');
            return;
        }

        const {username, password, type} = form.data;
        const data = {username, password, type};
        console.log(data)

        progressDialog.open();

        neonBinding.events.emit(this.path + "login", data).then(res => {
            console.log(this.path + "login res", res);
            if (!res) return res;

            this.auth.onAuthStateChanged(currentUser => {
                storage.onLogin(currentUser);
            });

            return execWhen(() => storage.loggedUserAuth).then(loggedUserAuth => loggedUserAuth.getIdTokenResult().then(idTokenResult => {
                storage.idTokenResult = idTokenResult;
                return res;
            }));
        }).then(res => {
            console.log("res", res)

            if (res && !isAdminApp && isObject(res) && res.contractor) {
                const {contractor, message} = res;
                if (message === "CONTRACTOR_EMAIL_RESTRICTION") {
                    infoDialog.open(<div className="text-left">
                        <b>Using this login details is prohibited</b><br/><br/>
                        Please contact <b>{contractor.data.name}</b> system administrator to set up your account if
                        it was not set up;<br/>
                    </div>);
                    return;
                }
                //setup user account
                this.refs.newContractorUserDialog.open(contractor);
                return;
            }

            return this.onComplete(res, true, type);
        }).finally(() => {
            setTimeout(() => progressDialog.close());
        }).catch(err => {
            console.error(err);
            infoDialog.open(<div>
                Sorry, we couldn't verify you at the moment.<br/>
                Please make sure you have internet connection and try again.<br/>
                If the issue persists, please contact support.
            </div>);
        });
    }

    // </editor-fold>

    get auth() {
        const {type: access_type} = this.form.data;
        if (access_type === "Contractor") {
            return auth2;
        }
        if (access_type === "Staff") {
            return auth_hr;
        }
        return auth;
    }

    get path() {
        if (isAdminApp) {
            return "admin/users/accounts/";
        }
        const {type} = this.form.data;
        if (type === "Contractor") {
            return "plugin_sheq_assist/contractors/users/";
        } else if (type === "Staff") {
            return "plugin_sheq_assist/employees/accounts/";
        } else {
            return "users/accounts/";
        }
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row
                    rendered
                    active
                    idx={1}
                    title="1. Email Address / Phone No."
                    sectionClassName="w-full"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                >
                    <ClearableInput name="username" type="text" placeholder="Email Address / Phone Number"
                                    className="form-control" onChange={this.form.onChange}/>
                    {!isAdminApp && <ClearableInput name="type" type="radio" placeholder="Login As" vertical
                                                    className="form-control" onChange={this.form.onChange}
                                                    values={this.state.lists.type}/>}
                </Row>
                <Row
                    rendered
                    idx={2}
                    title="2. Password"
                    sectionClassName="w-full"
                    nextText="Login"
                    onFormNext={this.onSubmit}
                    onFormBack={onFormBack}
                >
                    <ClearableInput name="password" type="password" placeholder="Password" className="form-control"
                                    onChange={this.form.onChange} onSubmit={this.onSubmit}/>
                    <a href="#" className="forgot-pass fixed-flex min-w-120 hor-center" onClick={this.onForgotPassword}>Forgot
                        Password?</a>
                </Row>
                {!isAdminApp && <Row
                    rendered
                    activeAlways
                    idx={5}
                    title="New User?"
                    sectionClassName="w-full"
                >
                    <Button ref="create" text="Create Account"
                            className="btn btn-primary min-w-260 hor-center margin-t-5" onClick={this.onSignUp}/>
                </Row>}
            </div>
            <LoginFaceDialog ref="loginFaceDialog"/>
            <SetupFaceDialog ref="setupFaceDialog"/>
            <SetupPhoneNumDialog ref="setupPhoneNumDialog"/>
            <VerifyPhoneNumDialog ref="verifyPhoneNumDialog"/>
            <SetupEmailPasswordDialog ref="setupEmailPasswordDialog"/>
            <SetupPhonePasswordDialog ref="setupPhonePasswordDialog"/>

            {!isAdminApp && <NewContractorUserDialog ref="newContractorUserDialog" isNewContractorUser/>}
        </div>);
    }

    // </editor-fold>
}

export default LoginPasswordDialog;
