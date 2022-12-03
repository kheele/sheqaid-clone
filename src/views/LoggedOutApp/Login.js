// <editor-fold defaultstate="collapsed" desc="import">
import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Button} from '../../components/inputs';

import LoginFaceDialog from '../../components/dialogs/LoginFaceDialog';
import LoginPasswordDialog from '../../components/dialogs/LoginPasswordDialog';
import SetupPhoneNumDialog from '../../components/dialogs/SetupPhoneNumDialog';

// </editor-fold>

@observer
class Login extends React.Component {
    path = "users/accounts/";

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
    async componentDidMount() {
        const {idTokenResult} = storage;
        if(!idTokenResult) {
            this.show();
            return;
        }

//        console.log('idTokenResult', idTokenResult)
        
        const {claims: {access_type}} = idTokenResult;        
        this.onAutoLogging(access_type);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onAutoLogging">
    onAutoLogging(access_type) {
        let path;
        if(access_type === "ContractorUser") {
            path = "plugin_sheq_assist/contractors/users/";
        } else if(access_type === "Staff") {
            path = "plugin_sheq_assist/employees/accounts/";
        } else {
            path = "users/accounts/";
        }
        
        progressDialog.open("Logging you in. Please wait...");
        neonBinding.events.emit(path + "login-auto").then(user => {
            console.log(path + "login-auto", access_type, user)
            if (!user || isString(user)) {
                this.show();
                infoDialog.open("An error occurred while trying to automatically login you in.");
                infoDialog.close(4000);
            } else if(isObject(user)) {
                storage.login.loginUser(user);
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
                    <label>SHEQ Aid - Login</label>
                    <div className="row row-login flex">
                        <Button className="btn btn-primary" onClick={this.onBiometric}>
                            <i className="fa fa-fingerprint icon-left"/>Biometric<br/>Authentication
                        </Button>
                        <Button className="btn btn-primary" onClick={this.onMultiFactor}>
                            <i className="fa fa-key icon-left"/>Multi-Factor<br/>Authentication
                        </Button>
                    </div>
                    <div className="row row-signup">
                        <Button ref="create" text="New User? Create Account" className="btn btn-primary min-w-260" onClick={this.onSignUp}/>
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