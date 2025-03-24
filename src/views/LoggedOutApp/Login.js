// <editor-fold defaultstate="collapsed" desc="import">
import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {execWhen} from 'utils/Utils';

import {Button} from 'components/inputs';

import LoginFaceDialog from 'components/dialogs/LoginFaceDialog';
import LoginPasswordDialog from 'components/dialogs/LoginPasswordDialog';
import SetupPhoneNumDialog from 'components/dialogs/SetupPhoneNumDialog';
import storage from "../../storage/Storage";

// </editor-fold>

@observer
class Login extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        display: true,
        rejectAutoLogin: false
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onRejectAutoLogin = this.onRejectAutoLogin.bind(this);
        this.onAllowAutoLogin = this.onAllowAutoLogin.bind(this);

        this.onSignUp = this.onSignUp.bind(this);
        this.onForgotPassword = this.onForgotPassword.bind(this);

        this.onBiometric = this.onBiometric.bind(this);
        this.onMultiFactor = this.onMultiFactor.bind(this);

        this.onAutoLogging = this.onAutoLogging.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        this.hide();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        const {idTokenResult} = storage;
        if (!idTokenResult) {
            this.show();
            return;
        }

        console.log('idTokenResult', idTokenResult)

        this.onAutoLogging(idTokenResult);
    }

    // </editor-fold>

    get access_type() {
        const {idTokenResult} = storage;
        const {claims: {access_type, aud, user_id}} = idTokenResult;

        if (access_type === "ContractorUser" || aud === 'sheqassist-8e36a') {
            return "ContractorUser";
        }
        if (access_type === "Staff" || aud === 'sheqassist-hr') {
            return "Staff";
        }
        return "User";
    }

    get path() {
        const {access_type} = this;
        if (access_type === "ContractorUser") {
            return "plugin_sheq_assist/contractors/users/";
        }
        if (access_type === "Staff") {
            return "plugin_sheq_assist/employees/accounts/";
        }
        return "users/accounts/";
    }

    get auth() {
        const {access_type} = this;
        if (access_type === "ContractorUser") {
            return auth2;
        }
        if (access_type === "Staff") {
            return auth_hr;
        }
        return auth;
    }

    // <editor-fold defaultstate="collapsed" desc="onAutoLogging">
    onAutoLogging(idTokenResult) {
        const {token} = idTokenResult;
        const {path, access_type} = this;
        console.log('onAutoLogging', this.path, path, access_type)

        progressDialog.open("Logging you in. Please wait...");
        workers.emit(path + "login-auto", token).then(res => {
            this.auth.onAuthStateChanged(currentUser => {
                storage.onLogin(currentUser);
            });

            return execWhen(() => storage.loggedUserAuth).then(loggedUserAuth => loggedUserAuth.getIdTokenResult().then(idTokenResult => {
                storage.idTokenResult = idTokenResult;
                return res;
            }));
        }).then(res => {
            console.log(path + "login-auto", res)
            if (!res || isString(res)) {
                this.show();
                infoDialog.open("An error occurred while trying to automatically login you in.");
                infoDialog.close(4000);
            } else if (isObject(res)) {
                storage.login.loginUser(res.loggedUser);
            }
        }).catch(err => {
            this.show();
        }).finally(() => {
            progressDialog.close();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="show">
    show() {
        this.state.display = true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="hide">
    hide() {
        this.state.display = false;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onRejectAutoLogin">
    onRejectAutoLogin() {
        this.state.rejectAutoLogin = true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onAllowAutoLogin">
    onAllowAutoLogin(e, btn) {
        this.state.rejectAutoLogin = false;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSignUp">
    onSignUp(e, btn) {
        this.props.onSignUp(e, btn);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onForgotPassword">
    onForgotPassword(e, btn) {
        this.props.onForgotPassword(e, btn);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onBiometric">
    onBiometric(e, btn) {
        this.refs.loginFaceDialog.open();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onMultiFactor">
    onMultiFactor(e, btn) {
        this.refs.loginPasswordDialog.open();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return this.state.display && (<React.Fragment>
            <div className="controls-wrapper min-w-475">
                <div className="controls scale-up-center login">
                    <label>SHEQ Intel - Login</label>
                    <div className="row row-login flex">
                        <Button className="btn btn-primary" onClick={this.onBiometric}>
                            <i className="fa fa-fingerprint icon-left"/>Biometric<br/>Authentication
                        </Button>
                        <Button className="btn btn-primary" onClick={this.onMultiFactor}>
                            <i className="fa fa-key icon-left"/>Multi-Factor<br/>Authentication
                        </Button>
                    </div>
                    <div className="row row-signup">
                        <Button ref="create" text="New User? Create Account" className="btn btn-primary min-w-260"
                                onClick={this.onSignUp}/>
                    </div>
                </div>
            </div>
            <LoginFaceDialog ref="loginFaceDialog"/>
            <LoginPasswordDialog
                ref="loginPasswordDialog"
                onRejectAutoLogin={this.onRejectAutoLogin}
                onAllowAutoLogin={this.onAllowAutoLogin}
                onSignUp={this.onSignUp}
                onForgotPassword={this.onForgotPassword}
            />
            <SetupPhoneNumDialog ref="setupPhoneNumDialog"/>
        </React.Fragment>);
    }

    // </editor-fold>
}

export default Login;