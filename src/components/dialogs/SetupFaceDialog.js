// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import Form from '../../utils/Form';

import {ProfileField} from '../inputs';
import {NavButtons} from '../FormComponents';
import AEditDialog from './AEditDialog';

import {
    CapturedImgView,
    detect,
    loadFaceModels,
    onCaptureFace,
    onUnmount,
    onVideoPlay,
    startVideo
} from './FaceComponents';

import style from './SetupFaceDialog.lazy.css';
import storage from "../../storage/Storage";
import {execWhen} from "../../utils/UtilsFuns";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class SetupFaceDialog extends AEditDialog {
    pageKey = "SetupFaceDialog";
    className = "AAuthDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Setup Biometric Authentication";
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

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable state = {
        modelsLoaded: false
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
        this.onSetupProceed = this.onSetupProceed.bind(this);

        this.form = new Form();
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

    // </editor-fold>

    get loggedUser() {
        return this.props.state.item;
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

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        this.onUnmount();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            this.startVideo();
        }

        return true;
    }

    onCancel() {
//        this.startVideo();
    }

    // <editor-fold defaultstate="collapsed" desc="onSetupProceed">
    onSetupProceed() {
        const {user: {id: uid}} = this.loggedUser;
        progressDialog.open();

        const {imgSrc} = this.refs.capturedImgView;

        neonBinding.events.emit(this.path + "setup/biometric", {uid, imgSrc}).then(res => {
            this.auth.onAuthStateChanged(currentUser => {
                storage.onLogin(currentUser);
            });

            return execWhen(() => storage.loggedUserAuth).then(loggedUserAuth => loggedUserAuth.getIdTokenResult().then(idTokenResult => {
                storage.idTokenResult = idTokenResult;
                return res;
            }));
        }).then(res => {
            progressDialog.close();

            console.log(this.path + "setup/biometric", res)
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
                    case "ERR_UPLOAD":
                        infoDialog.open(<div>
                            Sorry, the biometric photo couldn't be uploaded.<br/>
                            Please try again later.<br/>
                            If the issue persists, please contact support.
                        </div>);
                        break;
                    case "ERR_UPDATE_USER":
                    case "ERR_CREATING_TOKEN":
                    default:
                        infoDialog.open(<div>
                            Sorry, we couldn't update your biometric at the moment.<br/>
                            Please try again later.<br/>
                            If the issue persists, please contact support.
                        </div>);
                        break;
                }
            } else if (isObject(res)) {
                const {loggedUserAuth: currentUser} = storage;
                if (currentUser) {
                    storage.login.loginUser(res);
                    this.props.dialog.close();
                } else {
                    infoDialog.open("Authentication failed.");
                }
            }
        }).catch(err => {
            console.error(err);
            progressDialog.close();
            infoDialog.open(<div>
                Sorry, we couldn't update your biometric at the moment.<br/>
                Please make sure you have internet connection and try again.<br/>
                If the issue persists, please contact support.
            </div>);
        });
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.loggedUser) return null;
        if (!this.state.modelsLoaded) {
            return <div className="fixed-center"><CircularProgress/></div>;
        }
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
            },
            loggedUser: {
                user: {data: {fname, lname, username, phone}},
                access_type
            }
        } = this;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>1. My Profile</label>
                    <div className="row sec-group w-full">
                        <ProfileField title="First Name" name="fname" value={fname} className="col-lg-6"/>
                        <ProfileField title="Last Name" name="lname" value={lname} className="col-lg-6"/>
                        <ProfileField title="Email Address" name="username" value={username} className="col-lg-6"/>
                        <ProfileField title="Phone Number" name="phone" value={phone} className="col-lg-6"/>
                        <ProfileField title="Access Type" name="access_type" value={access_type} className="col-lg-12"/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row row-capture">
                    <label>2. Face Authentication (Video Capture)</label>
                    <div className="row sec-group">
                        <div ref="videoContainer" id="video-container" className="flex">
                            <video ref="video" width="570" height="394" muted onPlay={this.onVideoPlay}/>
                            <CapturedImgView ref="capturedImgView" onCancel={this.onCancel}
                                             onSubmit={this.onSetupProceed}/>
                            <p className="flex margin-0">Please make sure you are facing the camera and your environment
                                has good light.</p>
                        </div>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={this.onCaptureFace} nextText="Capture Face"/>
                </div>
            </div>
        </div>);
    }

    // </editor-fold>
}

export default SetupFaceDialog;
