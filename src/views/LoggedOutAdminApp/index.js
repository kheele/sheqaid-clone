import React from 'react';
import {observer} from 'mobx-react';
import {autorun} from 'mobx';
import Footer from '../Footer';

import {execWhen} from '../../utils/Utils';

import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';

import style from './LoggedOutAdminApp.lazy.css';

@observer
class LoggedOutApp extends React.Component {

    constructor() {
        super();

        window.loggedOutApp = this;

        this.onForgotPassword = this.onForgotPassword.bind(this);
        this.onSignUp = this.onSignUp.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    componentWillMount() {
//        style.use();
    }

    async componentDidMount() {
        autorun(() => {
            if (!storage.is.isLoggedIn) {
                style.use();
            } else {
                style.unuse();
            }
        });
        
        const loggedUser = await indexedStorage.loggedUser.find(1);
        if(!loggedUser) return;
        
        let {profile_pic} = loggedUser.company.data;
        if (!profile_pic) {
            profile_pic = {dlUrls: ['../logo.svg']};
        }
        
        execWhen(() => this.refs.logoImg).then(logoImg => {
            logoImg.src = profile_pic.dlUrls[0]; 
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    onForgotPassword(e, btn) {
        this.refs.login.hide();
        this.refs.forgotPassword.show();
    }

    onSignUp(e, btn) {
        this.refs.login.hide();
        this.refs.signup.show();
    }

    onLogin(e, btn) {
        this.refs.login.show();
        this.refs.signup.hide();
        this.refs.forgotPassword.hide();
    }

    render() {
        return (!storage.is.isLoggedIn && <div className="LoggedOutApp nice-scrollbars">
            <div className="logo">
                <img ref="logoImg" src="../logo.svg"/>
            </div>
            <div className="controls-wrapper min-w-475">
                <Login ref="login" onSignUp={this.onSignUp} onForgotPassword={this.onForgotPassword}/>
                <Signup ref="signup" onBack={this.onLogin}/>
                <ForgotPassword ref="forgotPassword" onBack={this.onLogin}/>
            </div>
            <Footer />
        </div>);
    }
}

export default LoggedOutApp;
