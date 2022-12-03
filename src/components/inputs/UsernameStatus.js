// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import Button from './Button';
import ClearableInput from './ClearableInput';

import Form from '../../utils/Form';
import {onConfirmUserOTP, onSendUserOTP} from '../../utils/UsersFuns';

import style from "./UsernameStatus.lazy.css";

// </editor-fold>

@observer
class UsernameStatus extends React.Component {

    @observable state = {
        status: 'SEND',// SEND, SENT, CONFIRMED
        uid: null
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onBack = this.onBack.bind(this);
        this.onSendOTP = this.onSendOTP.bind(this);
        this.onConfirmOTP = this.onConfirmOTP.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount, componentWillUnmount">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        autorun(() => {
            const {
                access_type,
                onChange,
                usernameStatus,
                usernameStatus: {valid, required, duplicate, exist, uid, token, username, loading}
            } = this.props;
            onChange && onChange(this.state);
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onBack">
    onBack(evt, btn) {

    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSendOTP">
    onSendOTP(evt, btn) {
        const {access_type, usernameStatus: {valid, required, duplicate, exist, uid, token, username, loading}} = this.props;
        let onSend;
//        if(access_type === 'ContractorUser') {
//            onSend = onSendOTPContractor;
//        } else {
            onSend = onSendUserOTP;
//        }
        onSendUserOTP(username).then(res => {
            if (res) {
                this.state.status = 'SENT';
                infoDialog.open(<div>
                    One-Time Password successfully sent.<br/>
                    Please open your email address and<br/>
                    copy the One-Time Password and enter it<br/>
                    on the input field provided.
                </div>);
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onConfirmOTP">
    onConfirmOTP(evt, btn) {
        const {
            access_type,
            onChange,
            usernameStatus,
            usernameStatus: {valid, required, duplicate, exist, uid, token, username, loading}
        } = this.props;
        const {form} = this;

        if (!form.isValid('code')) {
            infoDialog.open('One-Time Password is required');
            return;
        }

        const {code} = form.data;
        const data = {username, code, access_type};
        let onConfirm;
//        if(access_type === 'ContractorUser') {
//            onConfirm = onConfirmContractorOTP;
//        } else {
            onConfirm = onConfirmUserOTP;
//        }
        onConfirm(data).then(res => {
            if (res) {//{uid, token}
                const {uid, token} = res;
                infoDialog.open('One-Time Password successfully verified');
                usernameStatus.uid = uid;
                usernameStatus.token = token;
                this.state.uid = uid;
                this.state.token = token;
                this.state.status = 'CONFIRMED';
                onChange && onChange(this.state);
            }
        });
    }

    // </editor-fold>

    @computed
    get isAvailable() {
        const {usernameStatus: {valid, required, duplicate, exist, uid, token, username, loading}} = this.props;
        return !(loading || !valid || !username || required || duplicate || exist);
    }

    @computed
    get isRequired() {
        const {usernameStatus: {valid, required, duplicate, exist, uid, token, username, loading}} = this.props;
        return required;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {valid, required, duplicate, exist, username, loading, uid} = this.props.usernameStatus;
        if (!username) {
            return null;
        }
        
        const layer = <div className="UsernameStatus-layer"/>
        if (loading) {
            return <React.Fragment>
                <div className="UsernameStatus loading grid-1 flex-center">
                    <CircularProgress/>
                    <span className="margin-t-5">Processing...</span>
                </div>
                {layer}
            </React.Fragment>;
        }
        if (!valid) {
            return <React.Fragment>
                <p className="UsernameStatus red">
                    <i className="fa fa-times margin-r-5"/>
                    Email Address / Username is not a valid email
                </p>
                {layer}
            </React.Fragment>;
        }
        if (required) {
            return <p className="UsernameStatus red">
                <i className="fa fa-times margin-r-5"/>
                Email Address / Username is required
            </p>;
        }
        if (duplicate) {
            return <React.Fragment>
                <p className="UsernameStatus red">
                    <i className="fa fa-times margin-r-5"/>
                    <span>Another account is using this Email Address / Username</span>
                </p>
                {layer}
            </React.Fragment>;
        }
        if (exist) {
            const {status} = this.state;
            if (status === 'SEND') {
                return <React.Fragment>
                    <div className="UsernameStatus grid-1 exist send">
                        Email Address / Username requires verification
                        <hr className="w-full margin-t-10 margin-b-0"/>
                        <p className="text-center margin-t-10 margin-b-0 font-size-15">Click "Send OTP" button to receive
                            One-Time Password on your email address</p>
                        <p className="text-center margin-v-10 font-size-15">Enter One-Time Password you will
                            receive on the next step provided</p>
                        <hr className="w-full pull-left margin-v-5"/>
                        <Button
                            className="btn btn-primary hor-center w-200 border-radius-20 padding-5 margin-t-10 margin-b-5"
                            text="Send OTP" onClick={this.onSendOTP}/>
                    </div>
                    {layer}
                </React.Fragment>;
            } else if (status === 'SENT') {
                return <React.Fragment>
                    <div className="UsernameStatus grid-1 exist sent">
                        Email Address / Username requires verification
                        <hr className="w-full margin-t-10 margin-b-0"/>
                        <p className="text-center margin-v-10 font-size-15">Please enter One-Time Password sent
                            to your email address:</p>
                        <ClearableInput name="code" type="password" placeholder="One-Time Password"
                                        className="max-w-360 hor-center form-control" onChange={this.form.onChange}/>
                        <Button className="btn btn-primary hor-center w-200 border-radius-20 padding-5 margin-t-0"
                                text="Verify OTP" onClick={this.onConfirmOTP}/>
                        <p className="text-center bg-white w-auto max-w-320 padding-5 border-radius-20 margin-v-15 color-red font-size-15">"One-Time Password" expires after 30
                            minutes</p>
                        <hr className="w-full pull-left margin-t-0 margin-b-5"/>
                        <Button
                            className="btn btn-primary hor-center w-200 border-radius-20 padding-5 margin-t-10 margin-b-5"
                            text="Re-Send OTP" onClick={this.onSendOTP}/>
                    </div>
                    {layer}
                </React.Fragment>;
            } else if (status === 'CONFIRMED') {
                return <div className="UsernameStatus grid-1 exist confirmed">
                    Email Address / Username successfully verified
                    <hr className="w-full margin-v-10"/>
                    {/*<ClearableInput ref="password" name="password" type="password" placeholder="Password" className="form-control" onChange={this.form.onChange}/>*/}
                </div>;
            }
        }

        return <p className="UsernameStatus green">
            <i className="fa fa-check margin-r-5"/>
            Email Address / Username is available
        </p>;
    }

    // </editor-fold>
}

export default UsernameStatus;