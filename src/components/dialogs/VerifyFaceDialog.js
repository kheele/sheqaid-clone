// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import * as faceapi from 'face-api.js';

import Form from '../../utils/Form';

import {Button} from '../inputs';
import Dialog from './Dialog';

import {
    CapturedImgView,
    detect,
    loadFaceModels,
    onCaptureFace,
    onUnmount,
    onVideoPlay,
    startVideo
} from './FaceComponents';

import style from './VerifyFaceDialog.lazy.css';

// </editor-fold>

@observer
class VerifyFaceDialog extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable state = {
        modelsLoaded: false
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onCancel = this.onCancel.bind(this);
        
        this.onUnmount = onUnmount.bind(this);
        this.startVideo = startVideo.bind(this);
        this.onVideoPlay = onVideoPlay.bind(this);
        this.detect = detect.bind(this);
        
        this.onCaptureFace = onCaptureFace.bind(this);
        this.onLoginProceed = this.onLoginProceed.bind(this);

        this.form = new Form();
    }
    // </editor-fold>

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        this.onUnmount();
        style.unuse();
    }

    // <editor-fold defaultstate="collapsed" desc="onLoginProceed">
    onLoginProceed() {
        const {form} = this;
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
            if(isContractor) {
                path = "plugin_sheq_assist/contractors/users/";
            } else if(isEmployee) {
                path = "plugin_sheq_assist/employees/accounts/";
                username = email;
            } else if(isUser) {
                path = "users/accounts/";
            }

            neonBinding.events.emit(path + "login/biometric", {username, match, displaySize}).then(res => {
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
                } else if(isObject(res)) {
                    const {loggedUserAuth: currentUser} = storage;
                    if (currentUser) {
                        this.onResponse && this.onResponse();
                        this.close();
                    } else {
                        infoDialog.open("Authentication failed.");
                    }
                }
            }).catch(err => {
                console.error(err);
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
            if(idTokenResult) {
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
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="open">
    open(title = "Verify Yourself") {
        this.state.modelsLoaded = false;
        return new Promise((resolve, reject) => {
            this.refs.dialog.open(title);
            loadFaceModels().then(() => {
                this.state.modelsLoaded = true;
                this.startVideo();
            });
            this.onResponse = resolve;
        });
    }
    // </editor-fold>

    close() {
        this.onUnmount();
        this.refs.dialog.close();
    }

    onCancel(e, btn) {
        this.close();
    }

    @computed
    get bottomButtons() {
        return <Button className="btn btn-primary" text="Capture Face" onClick={this.onCaptureFace}/>;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return (<Dialog 
            key="VerifyFaceDialog" 
            ref="dialog" 
            className="VerifyFaceDialog AAuthDialog BiometricView"
            bottomButtons={this.bottomButtons}
            onCancel={this.onCancel}
            >
            <div className="controls-wrapper">
                <BiometricView ref="biometricView" state={this.state} onVideoPlay={this.onVideoPlay} onLoginProceed={this.onLoginProceed}/>
            </div>
        </Dialog>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="BiometricView">
@observer
class BiometricView extends React.Component {
    render() {
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
                        <p className="flex margin-0">Please make sure you are facing the camera and your environment has good light.</p>
                    </div>
                </div>
            </div>}
        </div>;
    }
}
// </editor-fold>

export default VerifyFaceDialog;
