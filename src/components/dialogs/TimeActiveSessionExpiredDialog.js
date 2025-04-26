// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import * as faceapi from 'face-api.js';

import Form from '../../utils/Form';

import {Button, ClearableInput} from '../inputs';
import Dialog from './Dialog';

import VerifyPhoneNumDialog from './VerifyPhoneNumDialog';

import {
    CapturedImgView,
    detect,
    loadFaceModels,
    onCaptureFace,
    onUnmount,
    onVideoPlay,
    startVideo
} from './FaceComponents';

import style from './TimeActiveSessionExpiredDialog.lazy.css';

// </editor-fold>

@observer
class TimeActiveSessionExpiredDialog extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable state = {
        modelsLoaded: false,
        verifyPhoneNum: false

    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

        this.onUnmount = onUnmount.bind(this);
        this.startVideo = startVideo.bind(this);
        this.onVideoPlay = onVideoPlay.bind(this);
        this.detect = detect.bind(this);

        this.onCaptureFace = onCaptureFace.bind(this);
        this.onLoginProceed = this.onLoginProceed.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    @computed
    get verifyPhoneNum() {
        return this.state.verifyPhoneNum;
    }

    set verifyPhoneNum(val) {
        this.state.verifyPhoneNum = val;
    }

    @computed
    get bottomButtons() {
        const _isMultiFactor = isMultiFactor();
        const title = _isMultiFactor ? "Login" : "Capture Face";
        const onClick = _isMultiFactor ? this.onSubmit : this.onCaptureFace;
        return <Button className="btn btn-primary" text={title} onClick={onClick}/>;
    }

    // </editor-fold>

    componentWillMount() {
        style.use();
    }

    // </editor-fold>

    componentWillUnmount() {
        const {dialog} = this.refs;
        dialog && $(dialog.getDOMNode()).css('z-index', 1500);
        !isMultiFactor() && this.onUnmount();
        style.unuse();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onLoginProceed">
    onLoginProceed() {
        const {form} = this;

        const {dialog} = this.refs;
        $(dialog.getDOMNode()).css('z-index', 1400);

        progressDialog.open();

        const onProceed = (idTokenResult) => {
            const {isEmployee, isUser, isContractor} = storage.is;
            const {claims: {user_id}} = idTokenResult;

            const {user} = storage.loggedUser;
            let {username, email} = user.data;

            const {imgSrc, faceDescriptor, displaySize} = this.refs.biometricView.refs.capturedImgView;
            const faceMatcher = new faceapi.FaceMatcher(faceDescriptor, 0.5);
            const match = faceMatcher.toJSON();

            let path;
            if (isContractor) {
                path = "plugin_sheq_assist/contractors/users/";
            } else if (isEmployee) {
                path = "plugin_sheq_assist/employees/accounts/";
                username = email;
            } else if (isUser) {
                path = "users/accounts/";
            }

            workers.emit(path + "login/biometric", {username, match, displaySize}).then(res => {
                progressDialog.close();

                if (!res) {
                    infoDialog.open("Authentication failed.");
                } else if (isString(res)) {
                    switch (res) {
                        case "NO_USER_AUTH":
                            infoDialog.open(<div>
                                Sorry, the user associated with this<br/>
                                <b>Email Address</b> or <b>Phone Number</b> does not exist.
                            </div>);
                            break;
                        case "NO_USER_DB":
                            infoDialog.open(<div>
                                Sorry, the user associated with this<br/>
                                <b>Email Address</b> or <b>Phone Number</b> does not exist.<br/><br/>
                                The user could have been deleted from the system.
                            </div>);
                            break;
                        case "NO_BIOMETRIC":
                            infoDialog.open(<div>
                                Sorry, the user associated with this<br/>
                                <b>Email Address</b> or <b>Phone Number</b> does not have<br/>
                                permission to authenticate using biometric.
                            </div>);
                            break;
                        case "NO_DETECTION":
                            infoDialog.open(<div>
                                Sorry, the user associated with this<br/>
                                <b>Email Address</b> or <b>Phone Number</b> does not have a valid biometric.<br/><br/>
                            </div>);
                            break;
                        case "UNKNOWN_DETECTION":
                            infoDialog.open(<div>
                                Sorry, the user associated with this<br/>
                                <b>Email Address</b> or <b>Phone Number</b> couldn't be verified.<br/><br/>
                            </div>);
                            break;
                        case "ERR_LOAD_MODELS":
                        case "ERR_CREATING_TOKEN":
                        default:
                            infoDialog.open(<div>
                                Sorry, we couldn't verify you at the moment.<br/>
                                Please try again later.<br/>
                                If the issue persists, please contact support.
                            </div>);
                            break;
                    }
                } else if (isObject(res)) {
                    const {loggedUserAuth: currentUser} = storage;
                    if (currentUser) {
                        this.onResponse && this.onResponse();

                        const {updateLastTimeActive, state} = this.props;
                        state.timeActiveSessionExpired = false;
                        updateLastTimeActive();
                    } else {
                        infoDialog.open("Authentication failed.");
                    }
                }
            }).catch(err => {
                console.error(err);
//                $(dialog.getDOMNode()).css('z-index', 1500);

                progressDialog.close();
                infoDialog.open(<div>
                    Sorry, we couldn't verify you at the moment.<br/>
                    Please make sure you have internet connection and try again.<br/>
                    If the issue persists, please contact support.
                </div>);
            });
        };

        const {loggedUserAuth: currentUser} = storage;
        if (currentUser) {
            const {idTokenResult} = storage;
            if (idTokenResult) {
                onProceed(idTokenResult);
            } else {
                currentUser.getIdTokenResult(true).then(idTokenResult => {
                    storage.idTokenResult = idTokenResult;
                    onProceed(idTokenResult);
                }).catch(err => {
                    progressDialog.close();
                    infoDialog.open('You are required to logout and login again').then(() => {
                        this.close();
                        storage.logout.signOutOnlyAuth();
                    });
                });
            }
        } else {
            progressDialog.close();
            infoDialog.open('You are required to logout and login again').then(() => {
                this.close();
                storage.logout.signOutOnlyAuth();
            });
        }
    }

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn) {
        const {form} = this;

        if (!form.isValid('password')) {
            infoDialog.open('Password is required');
            return;
        }

        const {dialog} = this.refs;
        $(dialog.getDOMNode()).css('z-index', 1400);

        progressDialog.open();
        btn.text("Logging in...").disabled();

        const onProceed = (idTokenResult) => {
            const {isEmployee, isUser, isContractor} = storage.is;
            const {claims: {user_id}} = idTokenResult;

            const {user} = storage.loggedUser;
            const {username, email} = user.data;
            const {password} = form.data;
            const data = {password};
            //        console.log(data)

            let path;
            if (isContractor) {
                path = "plugin_sheq_assist/contractors/users/";
                data.username = username;
            } else if (isEmployee) {
                path = "plugin_sheq_assist/employees/accounts/";
                data.email = email;
            } else if (isUser) {
                path = "users/accounts/";
                data.username = username;
            }

            workers.emit(path + "login", data).then(res => {
                progressDialog.close();
                btn.text("Login").enabled();
                if (!res) {
                    //
                    infoDialog.open("Authentication failed.");
                } else if (res === 'auth/too-many-requests') {
                    //
                    infoDialog.open("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.");
                } else if (res) {
                    this.verifyPhoneNum = true;
                    this.refs.verifyPhoneNumDialog.open(res).then(() => {
                        //
                        this.onResponse && this.onResponse();

                        const {updateLastTimeActive, state} = this.props;
                        state.timeActiveSessionExpired = false;
                        updateLastTimeActive();
                        this.verifyPhoneNum = false;
                    });
                }
            }).catch(e => {
//                $(dialog.getDOMNode()).css('z-index', 1500);

                progressDialog.close();
                btn.text("Login").enabled();
            });
        };

        const {loggedUserAuth: currentUser} = storage;
        if (currentUser) {
            const {idTokenResult} = storage;
            if (idTokenResult) {
                onProceed(idTokenResult);
            } else {
                currentUser.getIdTokenResult(true).then(idTokenResult => {
                    storage.idTokenResult = idTokenResult;
                    onProceed(idTokenResult);
                }).catch(err => {
                    progressDialog.close();
                    btn.text("Login").enabled();
                    infoDialog.open('You are required to logout and login again').then(() => {
                        this.close();
                        storage.logout.signOutOnlyAuth();
                    });
                });
            }
        } else {
            progressDialog.close();
            btn.text("Login").enabled();
            infoDialog.open('You are required to logout and login again').then(() => {
                this.close();
                storage.logout.signOutOnlyAuth();
            });
        }
    }

    // <editor-fold defaultstate="collapsed" desc="open">
    open(title = "Your Session Has Expired") {
        const _isMultiFactor = isMultiFactor();
        !_isMultiFactor && (this.state.modelsLoaded = false);
        return new Promise((resolve, reject) => {
            this.refs.dialog.open(title);
            if (!_isMultiFactor) {
                loadFaceModels().then(() => {
                    this.state.modelsLoaded = true;
                    this.startVideo();
                });
            }
            this.onResponse = resolve;
        });
    }

    close() {
        !isMultiFactor() && this.onUnmount();
        this.refs.dialog.close();
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {timeActiveSessionExpired} = this.props.state;
        if (!timeActiveSessionExpired)
            return null;

        return (<Dialog
            key="TimeActiveSessionExpiredDialog"
            ref="dialog"
            className={"TimeActiveSessionExpiredDialog AAuthDialog " + (isMultiFactor() ? "MultiFactorView" : "BiometricView")}
            preventEsc
            noBackAction
            bottomButtons={this.bottomButtons}
            dialog={this}
        >
            <div className="controls-wrapper">
                <MultiFactorView onChange={this.form.onChange}/>
                <BiometricView ref="biometricView" state={this.state} onVideoPlay={this.onVideoPlay}
                               onLoginProceed={this.onLoginProceed}/>
            </div>
            {isMultiFactor() && <VerifyPhoneNumDialog ref="verifyPhoneNumDialog" isReauth/>}
        </Dialog>);
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="MultiFactorView">
@observer
class MultiFactorView extends React.Component {
    render() {
        if (!isMultiFactor()) return null;

        const {onChange} = this.props;
        return <div className="controls">
            <div className="row">
                <p className="text-center margin-v-5">Please enter your password to verify your details</p>
            </div>
            <div className="row padding-10">
                <ClearableInput name="password" type="password" placeholder="Password"
                                className="w-auto margin-h-5 margin-b-10 form-control" onChange={onChange}/>
            </div>
        </div>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="BiometricView">
@observer
class BiometricView extends React.Component {
    render() {
        if (isMultiFactor()) return null;

        const {state, onVideoPlay, onLoginProceed} = this.props;
        return <div className="controls">
            {!state.modelsLoaded && <div className="fixed-center"><CircularProgress/></div>}
            {state.modelsLoaded && <div className="row">
                <p className="text-center margin-t-5 margin-b-0">Please face the camera to verify your details</p>
            </div>}
            {state.modelsLoaded && <div className="row row-capture">
                <label>Face Authentication (Video Capture)</label>
                <div className="row sec-group">
                    <div ref="videoContainer" id="video-container" className="flex">
                        <video ref="video" width="570" height="394" muted onPlay={onVideoPlay}/>
                        <CapturedImgView ref="capturedImgView" onSubmit={onLoginProceed}/>
                        <p className="flex margin-0">Please make sure you are facing the camera and your environment has
                            good light.</p>
                    </div>
                </div>
            </div>}
        </div>;
    }
}

// </editor-fold>

const isMultiFactor = () => {
    const {loggedUser} = storage;
    if (!loggedUser) return null;
    const {user: {data: {username, auth_type = "MultiFactor", has_biometric}}} = loggedUser;
    return auth_type === "MultiFactor";
};

export default TimeActiveSessionExpiredDialog;
