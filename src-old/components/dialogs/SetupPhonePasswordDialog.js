// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../utils/Form';

import {ClearableInput, ProfileField} from '../inputs';
import {Row} from '../FormComponents';
import AEditDialog from './AEditDialog';

import style from './SetupPhonePasswordDialog.lazy.css';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class SetupPhonePasswordDialog extends AEditDialog {
    pageKey = "SetupPhonePasswordDialog";
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
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable state = {
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);
        
        this.onVerifyPhone = this.onVerifyPhone.bind(this);
        this.onVerifyCode = this.onVerifyCode.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 2) {
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
            
            this.onVerifyPhone(e, btn);
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onVerifyPhone">
    onVerifyPhone(e, btn) {
        const onVerify = () => {
            return storage.login.onVerifyPhoneAuth(
                this.item.username, 
                this.appVerifier, 
                verificationId => this.verificationId = verificationId,
                this.props.onFormGotoNext,
                this.props.onFormGotoPrev
            );
        };
        if(this.appVerifier) {
            return onVerify();
        }
        
        let {recaptchaContainer} = this.refs;        
        this.appVerifier = storage.login.createPhoneAuthVerifier(recaptchaContainer.id);
        onVerify();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onVerifyCode">
    onVerifyCode(e, btn) {
        const {form} = this;
        if (!form.isValid('code')) {
            infoDialog.open('Verification Code is required');
            return false;
        }
        
        const {code, password} = form.data;
        
        const {id, username, type} = this.item;

        btn.disabled();
        progressDialog.open();
        
        const {loggedUserAuth: currentUser} = storage;   
        const credential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, code);
        currentUser.updatePhoneNumber(credential).then(() => {
            const data = {id, phone: username, password};
            neonBinding.events.emit(this.path + "setup/password", data).then(loggedUser => {
                infoDialog.open("Password successfully set up.");
                infoDialog.close(2000);

                const {dialog} = this.props;
                dialog.onResponse();
                dialog.close();

                //now login
                storage.login.loginUser(loggedUser);
            }).catch(err => {
                console.error(err);
                infoDialog.open(<div>Sorry, we couldn't update your password at the moment.<br/>Please try again later.<br/>If the issue persists, please contact support.</div>);
            }).finally(() => {
                btn.enabled();
                progressDialog.close();
            });
        }).catch(err => {
            btn.enabled();
            progressDialog.close();
            console.error(err);
            switch(err.code) {
                case 'auth/credential-already-in-use':
                    infoDialog.open(<div>Sorry, the phone number you provided<br/>is already in use by another account.</div>);
                    break;
                case 'auth/invalid-verification-code':
                    infoDialog.open(<div>Sorry, you have entered<br/>an invalid verification code.</div>);
                    break;
                case 'auth/invalid-verification-id':
                default:
                    infoDialog.open(<div>Sorry, we couldn't verify your phone number at the moment.<br/>Please try again later.<br/>If the issue persists, please contact support.</div>);
                    break;
            }
        });
    }
    // </editor-fold>
    
    get path() {
        if(isAdminApp) {
            return "admin/users/accounts/";
        }
        const {type} = this.item;
        if(type === "Contractor") {
            return "plugin_sheq_assist/contractors/users/";
        } else if(type === "Staff") {
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
        if(!this.item) return null;
        
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
                    title="1. Phone Number"
                    sectionClassName="w-full"
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <ProfileField title="Phone Number" name="phone" value={username} className="col-lg-12"/>
                    {!isAdminApp && <ProfileField title="Access Type" name="access_type" value={type} className="col-lg-12"/>}
                </Row>
                <Row 
                    rendered 
                    idx={2} 
                    title="2. New Password"
                    sectionClassName="w-full"
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="password" type="password" placeholder="Password" className="form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="password_conf" type="password" placeholder="Confirmation Password" className="form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={3} 
                    title="3. Security Verification"
                    sectionClassName="padding-t-10 padding-b-5"
                    onFormBack={onFormBack} 
                >
                    <div ref="recaptchaContainer" id="recaptcha-container"/>
                </Row>
                <Row 
                    rendered 
                    idx={4} 
                    title="4. Verification Code Confirmation"
                    nextText="Verify Code" 
                    onFormNext={this.onVerifyCode}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="code" type="text" placeholder="Verification Code" footerDesc="Please enter verification code received by an SMS" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default SetupPhonePasswordDialog;
