// <editor-fold defaultstate="collapsed" desc="import">
import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {getExternalLinkData} from 'utils/ExternalLinkFuns';
import {Button, ClearableInput} from 'components/inputs';

// </editor-fold>

@observer
class Login extends React.Component {
    path = "users/accounts/";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        display: true
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onSubmit = this.onSubmit.bind(this);

        this.form = new Form();
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

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn) {
        const {form} = this;

        if (!form.isValid('username')) {
            infoDialog.open('Email Address is required');
            return;
        } else if (!form.get('username').isEmailAddress()){
            infoDialog.open('Email Address is not valid');
            return;
        }

        const {username} = form.data;
        console.log('data', username)

        btn.text("Logging in...").disabled();

        progressDialog.open();
        firebase.auth().signInWithEmailLink(username, window.location.href).then((result) => {
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
            const data = getExternalLinkData();
            console.log('signInWithEmailLink', data)
        }).catch((err) => {
            console.error(err);
            const {code, message} = err;
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
//            switch(code) {
//                case 'auth/argument-error': {
//                        inforDialog.open('');
//                }
//            }
        }).finally(() => {
            progressDialog.close();
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return this.state.display && (<React.Fragment>
            <div className="controls scale-up-center login">
                <label>SHEQ Aid Forms - Login</label>
                <div className="row row-login flex flex-column flex-center">
                    <ClearableInput name="username" type="text" placeholder="Email Address" className="form-control fixed-flex" onChange={this.form.onChange}/>
        
                    <Button className="btn btn-primary w-200 border-radius-20" text="Login" onClick={this.onSubmit}/>
                </div>
            </div>
        </React.Fragment>);
    }
    // </editor-fold>
}

export default Login;