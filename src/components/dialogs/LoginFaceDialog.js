// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import parsePhoneNumber from 'libphonenumber-js';
import {observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import * as faceapi from 'face-api.js';

import Form from '../../utils/Form';

import {ClearableInput} from '../inputs';
import {Row} from '../FormComponents';
import ANewDialog from './ANewDialog';
import ALoginControls from './ALoginControls';

import {
    CapturedImgView,
    detect,
    loadFaceModels,
    onCaptureFace,
    onUnmount,
    onVideoPlay,
    startVideo
} from './FaceComponents';

import SetupFaceDialog from './SetupFaceDialog';

import style from './LoginFaceDialog.lazy.css';
import storage from "../../storage/Storage";
import {execWhen} from "../../utils/UtilsFuns";
import {loginUserStep1ByUsername} from "mutations/send";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class LoginFaceDialog extends ANewDialog {
    pageKey = "LoginFaceDialog";
    className = "AAuthDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Biometric Authentication";
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
    @observable state = {
        modelsLoaded: false,
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

        this.onUnmount = onUnmount.bind(this);
        this.startVideo = startVideo.bind(this);
        this.onVideoPlay = onVideoPlay.bind(this);
        this.detect = detect.bind(this);

        this.onCaptureFace = onCaptureFace.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onLoginProceed = this.onLoginProceed.bind(this);

        this.form = new Form();
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

    // </editor-fold>

    get path() {
        const {type} = this.form.data;
        if (type === "Contractor") {
            return "plugin_sheq_assist/contractors/users/";
        } else if (type === "Staff") {
            return "plugin_sheq_assist/employees/accounts/";
        } else {
            return "users/accounts/";
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        this.state.modelsLoaded = false;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        loadFaceModels().then(() => {
            this.state.modelsLoaded = true;
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        this.onUnmount();
    }

    // <editor-fold defaultstate="collapsed" desc="onNext">
    async onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('username')) {
                infoDialog.open('Email Address / Phone Number is required');
                return;
            }
            if (!form.get('username').isEmailAddress()) {
                const phoneNumber = parsePhoneNumber(form.get('username'), 'ZA');
                if (!phoneNumber) {
                    infoDialog.open('Valid Email Address / Phone Number is required');
                    return false;
                }
                let phone = phoneNumber.formatNational().trim().replaceAll(' ', '');
                if (phone.startsWith('0')) {
                    phone = phone.substring(1, phone.length);
                }
                if (phone.length < 9) {
                    infoDialog.open('Valid Email Address / Phone Number is required');
                    return false;
                }
            }

            if (!form.isValid('type')) {
                infoDialog.open('Please select Login As [User, Contractor or Staff]');
                return false;
            }

            progressDialog.open();

            const {username, type: access_type} = form.data;

            try {
                const res = await loginUserStep1ByUsername({username, access_type});
                progressDialog.close();
                if (!res) {
                    infoDialog.open(<div>
                        Sorry, we couldn't verify you at the moment.<br/>
                        The {access_type} with this {username.isEmailAddress() ? 'Email Address' : 'Phone Number'} was
                        not
                        found
                    </div>);
                    return false;
                }
                console.log(res)
                if (this.isFailure(res)) {
                    this.onFailed(res);
                    return false;
                }
                const {uid, id} = res;
                if (access_type === "Staff") {
                    if (!uid) {
                        const {dialog} = this.props;
                        this.refs.setupPasswordDialog.open({id, username, type: access_type}).then(() => {
                            dialog.close();
                        });
                        return false;
                    }
                }
                this.state.uid = uid;
                this.startVideo();
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

    onCancel() {
//        this.startVideo();
    }

    // <editor-fold defaultstate="collapsed" desc="onLoginProceed">
    onLoginProceed() {
        const {form} = this;
        progressDialog.open();

        const {username, type} = form.data;

        const {imgSrc, faceDescriptor, displaySize} = this.refs.capturedImgView;
        const faceMatcher = new faceapi.FaceMatcher(faceDescriptor, 0.5);
        const match = faceMatcher.toJSON();

        workers.emit(this.path + "login/biometric", {username, match, displaySize}).then(res => {
            this.auth.onAuthStateChanged(currentUser => {
                storage.onLogin(currentUser);
            });

            return execWhen(() => storage.loggedUserAuth).then(loggedUserAuth => loggedUserAuth.getIdTokenResult().then(idTokenResult => {
                storage.idTokenResult = idTokenResult;
                return res;
            }));
        }).then(res => {
            progressDialog.close();
            this.onComplete(res, false, type);
        }).catch(err => {
            console.error(err);
            progressDialog.close();
            infoDialog.open(<div>
                Sorry, we couldn't verify you at the moment.<br/>
                Please make sure you have internet connection and try again.<br/>
                If the issue persists, please contact support.
            </div>);
        });
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.state.modelsLoaded) {
            return <div className="fixed-center"><CircularProgress/></div>;
        }
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
                    <ClearableInput name="type" type="radio" placeholder="Login As" vertical className="form-control"
                                    onChange={this.form.onChange} values={this.state.lists.type}/>
                </Row>
                <Row
                    rendered
                    idx={2}
                    title="2. Face Authentication (Video Capture)"
                    className="row-capture"
                    nextText="Capture Face"
                    onFormNext={this.onCaptureFace}
                    onFormBack={onFormBack}
                >
                    <div ref="videoContainer" id="video-container" className="flex">
                        <video ref="video" width="570" height="394" muted onPlay={this.onVideoPlay}/>
                        <CapturedImgView ref="capturedImgView" onCancel={this.onCancel} onSubmit={this.onLoginProceed}/>
                        <p className="flex margin-0">Please make sure you are facing the camera and your environment has
                            good light.</p>
                    </div>
                </Row>
            </div>
            <SetupFaceDialog ref="setupFaceDialog"/>
        </div>);
    }

    // </editor-fold>
}

export default LoginFaceDialog;
