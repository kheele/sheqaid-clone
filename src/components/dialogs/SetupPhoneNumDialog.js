// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {isValidPhoneNumber} from 'libphonenumber-js';
import {extendObservable} from 'mobx';

import Form from '../../utils/Form';

import {ClearableInput, SelectCountryCodeInput} from '../inputs';
import {NavButtons} from '../FormComponents';
import AEditDialog from './AEditDialog';

import style from './SetupPhoneNumDialog.lazy.css';
import storage from "../../storage/Storage";
import {execWhen} from "../../utils/UtilsFuns";
import {updateContractorUser, updateEmployee, updateUser} from "../../mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class SetupPhoneNumDialog extends AEditDialog {
    pageKey = "SetupPhoneNumDialog";
    className = "AAuthDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Please Setup Your Phone Number";
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
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);

        this.onChangePhoneNum = this.onChangePhoneNum.bind(this);
        this.onVerifyCode = this.onVerifyCode.bind(this);
        this.onVerifyPhone = this.onVerifyPhone.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    get isoCodeDef() {
        return this.props.dialog.extraProp('isoCode');
    }

    // </editor-fold>

    get phoneNumberDef() {
        return this.props.dialog.extraProp('phoneNumber');
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="phoneNumber">
    get phoneNumber() {
        const {form} = this;
        let {country, phone} = form.data;
        if (!country || !phone)
            return "";

        phone = String(phone).replaceAll(' ', '').replaceAll('+', '').replaceAll('(', '').replaceAll(')', '');
        const code = country.phone_code;
        if (phone.trim().replaceAll(" ", "").startsWith("0")) {
            return code + phone.substring(1);
        } else {
            return code + phone;
        }
    }

    // </editor-fold>

    get auth() {
        const {access_type} = this.loggedUser;
        if (access_type === "ContractorUser") {
            return auth2;
        }
        if (access_type === "Staff") {
            return auth_hr;
        }
        return auth;
    }

    get updateUserPhone() {
        const {access_type} = this.loggedUser;
        if (access_type === "Staff") {
            return updateEmployee;
        } else if (access_type === "ContractorUser") {
            return updateContractorUser;
        } else if (access_type === "User") {
            return updateUser;
        }
    }

    // </editor-fold>

    get path() {
        const {access_type: type} = this.loggedUser;
        if (type === "ContractorUser") {
            return "plugin_sheq_assist/contractors/users/";
        } else if (type === "Staff") {
            return "plugin_sheq_assist/employees/accounts/";
        } else {
            return "users/accounts/";
        }
    }

    get loggedUser() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    async componentDidMount() {

    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('country')) {
                infoDialog.open('Code is required');
                return false;
            }
            if (!form.isValid('phone')) {
                infoDialog.open('Phone Number is required');
                return false;
            }

            const isValid = isValidPhoneNumber(String(form.get('phone')), form.get('country').data.iso2);
            if (!isValid) {
                infoDialog.open('Phone Number is not valid');
                return;
            }

            this.onVerifyPhone(e, btn);
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChangePhoneNum">
    onChangePhoneNum(e, btn) {
        //this is Phone Number Details step
        this.props.onFormGotoPrev();
        this.props.onFormGotoPrev();
    }

    // <editor-fold defaultstate="collapsed" desc="onVerifyCode">
    onVerifyCode(e, btn) {
        const {form} = this;
        if (!form.isValid('code')) {
            infoDialog.open('Verification Code is required');
            return false;
        }

        const {code} = form.data;

        const {id} = this.loggedUser.user;

        btn.disabled();
        progressDialog.open();

        const data = {verificationId: this.verificationId, code};
        workers.emit(this.path + "setup-phone", data).then(async res => {
            if (!res) return;

            try {
                res = await this.updateUserPhone({id, phone: this.phoneNumber});
                if (!res) {
                    return null;
                }
            } catch (err) {
                console.error(err);
                return "UDATE_ERROR";
            }

            this.auth.onAuthStateChanged(currentUser => {
                storage.onLogin(currentUser);
            });

            return execWhen(() => storage.loggedUserAuth).then(loggedUserAuth => loggedUserAuth.getIdTokenResult().then(idTokenResult => {
                storage.idTokenResult = idTokenResult;
                return res;
            }));
        }).then(res => {
            if (res && isString(res)) {
                switch (res) {
                    case 'UDATE_ERROR':
                        infoDialog.open(<div>Sorry, you have entered<br/>an invalid verification code.</div>);
                        break;
                    case 'auth/code-expired':
                        infoDialog.open(<div>Sorry, the SMS code has expired.<br/>Please re-send the verification code
                            to try again.</div>);
                        break;
                    case 'auth/credential-already-in-use':
                        infoDialog.open(<div>Sorry, the phone number you provided<br/>is already in use by another
                            account.</div>);
                        break;
                    case 'auth/invalid-verification-code':
                        infoDialog.open(<div>Sorry, you have entered<br/>an invalid verification code.</div>);
                        break;
                    case 'auth/invalid-verification-id':
                    default:
                        infoDialog.open(<div>Sorry, we couldn't verify your phone number at the moment.<br/>Please try
                            again later.<br/>If the issue persists, please contact support.</div>);
                        break;
                }
            } else if (!res) {
                infoDialog.open(<div>Sorry, we couldn't verify your phone number at the moment.<br/>Please try again
                    later.<br/>If the issue persists, please contact support.</div>);
            } else {
                const {loggedUser, props: {dialog}} = this;
                extendObservable(loggedUser.user.data, data);
                infoDialog.open("Phone number successfully updated.");
                infoDialog.close(2000);

                if (!dialog.props.isReauth) {
                    //now login
                    storage.login.loginUser(loggedUser);
                }

                dialog.onResponse(true);
                dialog.close();
            }
        }).catch(err => {
            console.error(err);
            infoDialog.open(<div>Sorry, we couldn't verify your phone number at the moment.<br/>Please try again
                later.<br/>If the issue persists, please contact support.</div>);
        }).finally(() => {
            btn.enabled();
            progressDialog.close();
        });
    }

    // <editor-fold defaultstate="collapsed" desc="onVerifyPhone">
    onVerifyPhone(e, btn) {
        const onVerify = () => {
            return storage.login.onVerifyPhoneAuth(
                this.phoneNumber,
                this.appVerifier,
                verificationId => this.verificationId = verificationId,
                this.props.onFormGotoNext,
                this.props.onFormGotoPrev
            );
        };
        if (this.appVerifier) {
            return onVerify();
        }

        let {recaptchaContainer} = this.refs;
        this.appVerifier = storage.login.createPhoneAuthVerifier(recaptchaContainer.id);
        onVerify();
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.loggedUser)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active-always">
                    <label>1. Notice</label>
                    <div className="row sec-group">
                        <p className="margin-t-5 margin-b-0">
                            <b>Your Phone Number Is required for the following purposes:</b>
                        </p>
                        <p className="margin-t-5 margin-b-0">1. Multi-Factor Authentication</p>
                        <p className="margin-t-5 margin-b-0">
                            - We use <b>Multi-Factor Authentication</b> to verify you using your phone number.<br/>
                            - This is important for security purposes.
                        </p>
                    </div>
                </div>
                <div className="row active">
                    <label>2. Phone Number Details</label>
                    <div className="row sec-group">
                        <div className="row row-input flex">
                            <SelectCountryCodeInput name="country" type="select" placeholder="Code..."
                                                    defaultValue={this.isoCodeDef} className="fixed-flex form-control"
                                                    onChange={this.form.onChange}/>
                            <ClearableInput name="phone" type="number" placeholder="Phone Number"
                                            defaultValue={this.phoneNumberDef} footerDesc="Don't enter a leading zero"
                                            className="-margin-l-10 form-control" onChange={this.form.onChange}/>
                        </div>
                        <p className="margin-t-5 margin-b-0">
                            <i>- You will receive a <b>Verification Code</b> SMS on the <b>Phone Number</b> you have
                                provided</i><br/>
                            <i>- Please enter the <b>Verification Code</b> once received on the <b>next
                                step</b></i><br/>
                            <b>- Please make sure you have entered your phone number correctly</b>
                        </p>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>3. Security Verification</label>
                    <div className="row sec-group padding-t-10 padding-b-5">
                        <div ref="recaptchaContainer" id="recaptcha-container"/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack}/>
                </div>
                <div className="row">
                    <label>4. Verification Code Confirmation</label>
                    <div className="row sec-group">
                        <ClearableInput name="code" type="text" placeholder="Verification Code"
                                        footerDesc="Please enter verification code received by an SMS"
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={3} onBack={this.onChangePhoneNum} onNext={this.onVerifyCode}
                                backText="Change Phone Number" nextText="Verify Code"/>
                </div>
            </div>
        </div>);
    }

    // </editor-fold>
}

export default SetupPhoneNumDialog;
