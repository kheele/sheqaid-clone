import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./ProfilePic.lazy.css";

@observer
class ProfilePic extends React.Component {

    @observable
    state = {
        base64: null,
        path: null,
        profilePic: null
    };

    constructor() {
        super();

        this.setValue = this.setValue.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount() {
        style.use();
        this.state.profilePic = this.props.profilePic;
    }

    componentWillUnmount() {
        style.unuse();
    }

    setValue(val) {
        const {name, onChange} = this.props;
        onChange && onChange(val, name, this);
        this.state.profilePic = val;
    }

    onClick() {
        electronDialog.showOpenDialogImage().then(res => {
            console.log(res);
            if (res) {
                this.state.base64 = null;

                const {previewPath, path} = res;
                this.state.base64 = previewPath;
                this.state.path = path;

                const {id, role, name, onChange} = this.props;
                if (onChange) {
                    onChange(this.state, name, this);
                    return;
                }
                if (!role) {//AdminUser, User, Staff, Contractor, Client
                    return;
                }

                const {user, user: {data: {linked_employee_id}}} = storage.loggedUser;
                const {isEmployee, isUser, isContractor} = storage.is;

                progressDialog.open("Uploading Profile Photo. Please wait...");

                const upload = sockets.of("files").fn('upload');
                upload({role, id, path}).then(res => {
                    if (res) {
                        this.props.onUploaded && this.props.onUploaded(res);
                        infoDialog.open("Profile Photo successfully updated.");
                    } else {
                        infoDialog.open("An error occurred. Please try again.");
                    }
                    infoDialog.close(2000);
                }).finally(() => {
                    progressDialog.close();
                });
            }
        });
    }

    render() {
        let {
            state: {base64, path, profilePic},
            props,
            props: {children, className, readonly, displayCenter, fixedCenter, id}
        } = this;
        className = className || "";
        className += " ProfilePic text-center";
        if (fixedCenter) {
            className += " fixed-center";
        } else {
            if ('displayCenter' in props) {
                if (displayCenter) {
                    className += " hor-center";
                }
            } else {
                className += " hor-center";
            }
        }
        return <div className={className}>
            {profilePic ? <Val profilePic={profilePic} id={id}>{children}</Val> : (children ||
                <i className="fa fa-user"/>)}
            {!!base64 && <div className="preview"><img src={base64}/></div>}
            {!readonly && <i className="fa fa-camera-retro" onClick={this.onClick}/>}
        </div>;
    }
}

@observer
class Val extends React.Component {

    @observable
    state = {
        val: null,
        loaded: false
    };

    componentDidMount() {
        const {profilePic, id} = this.props;
        if (isObject(profilePic) && profilePic.dlUrls) {
            this.state.val = profilePic;
            this.state.loaded = true;
        } else if (!!id) {
            setTimeout(async () => {
                const path = `plugin_sheq_assist}/${profilePic}/profile-pic`;
                this.state.val = await window.neonBinding.events.emit(path, id);
                this.state.loaded = true;
            }, 0);
        }
    }

    render() {
        const {children} = this.props;
        const {val, loaded} = this.state;
        if (loaded && val && val.dlUrls) {
            return <img src={val.dlUrls[0]}/>;
        }
        return children || <i className="fa fa-user"/>;
    }
}

export default ProfilePic;
