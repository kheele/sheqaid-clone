// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {Dates, Permissions} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField, ProfilePic} from 'components/inputs';
import {Row} from 'components/FormComponents';

import {NewUserModulePermissions} from 'components/common-modules/ANewUserPermissions';

import EditPasswordDialog from "./EditPasswordDialog.js";

import style from "./ProfileDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "User";
  
    constructor(props) {
        super(props, style);
    }
    
    onEdit(evt, btn) {
        const {editDialog} = this.refs.controls.refs;
        editDialog && editDialog.open(this.state.item);
    }

    title() {
        return this.isLoggedUser ? "My Profile" : "User Profile";
    }
    
    get topButtonsHiddenEdit() {
        const {user} = storage.loggedUser;
        const {permissions_modules} = user.data;
        const permissions_modules_Users = (permissions_modules || []).find(v => v.key === "Users");
        if(!this.isLoggedUser) {
            return !Permissions.allowEdit(permissions_modules_Users);
        }
        return false;
    }
    
    get topButtonsHiddenDelete() {
        const {user} = storage.loggedUser;
        const {permissions_modules} = user.data;
        const permissions_modules_Users = (permissions_modules || []).find(v => v.key === "Users");
        if(!Permissions.allowRemove(permissions_modules_Users)) {
            return true;
        }
        return this.isLoggedUser;
    }
    
    get isLoggedUser() {
        const {user} = storage.loggedUser;
        const {item} = this.state;
        return item && item.id === user.id;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = 'admin/users/update/';
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            auth_type: [{text: "Multi-Factor Authentication (Password)", value: "MultiFactor", checked: true}, {text: "Biometric Authentication (Face)", value: "Biometric", checked: false}],
        },
        employee: null
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onUploaded = this.onUploaded.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.form = new Form();   
    }
    // </editor-fold>
    
    onUploaded(path) {
        this.item.data.profile_pic = path;
        if(this.isLoggedUser) {
            const {user} = storage.loggedUser;
            user.data.profile_pic = path;
            storage.update.updateDBUser(storage.loggedUser);
        }
    }
    
    onChangePassword() {
        this.refs.editPasswordDialog.open(this.item).then(newPass => {
            this.item.data.password = newPass; 
        });
    }
    
    get authTypeText() {
        const {item: {data: {auth_type = "MultiFactor"}}} = this;
        return this.state.lists.auth_type.find(v => v.value === auth_type).text;
    }

    get item() {
        return this.props.state.item;
    }

    get isLoggedUser() {
        const {user} = storage.loggedUser;
        return this.item.id === user.id;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {EditDialog} = this.props.dialog.props;
//        console.log('this.props.dialog', this.props.dialog)
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at, 
                    fname, lname, phone, username, password, profile_pic, 
                    auth_type = "MultiFactor",
                    permissions_modules
                }
            }
        } = this;
        
        console.log(this.item)
        
        const path = "admin/users/update/upload/profile-pic/user";
        
        let idx = 0;
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    {!this.isLoggedUser && <ProfilePic readonly profilePic={profile_pic}/>}
                    {this.isLoggedUser && <ProfilePic path={path} id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>}
                    <h3>{fname + ' ' + lname}</h3>
                    {created_at && <h5>{'Create On ' + Dates.formatDate(created_at)}</h5>}
                </React.Fragment>)}
                <Row 
                    active
                    rendered 
                    idx={1} 
                    title="1. User Details"
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfileField title="First Name" ref="fname" name="fname" value={fname} className="col-lg-6" onChange={this.form.onChange}/>
                    <ProfileField title="Last Name" ref="lname" name="lname" value={lname} className="col-lg-6" onChange={this.form.onChange}/>
                    {this.isLoggedUser && <ProfileField title="Phone Number" ref="phone" name="phone" value={phone} className="col-lg-12" onChange={this.form.onChange}/>}
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title={"2. Login Details"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    {this.isLoggedUser && <ProfileField title="Username / Email Address" ref="username" name="username" type="email" value={username} className="col-lg-12" onChange={this.form.onChange}/>}
                    <ProfileField title="Authentication Type" name="auth_type" value={this.authTypeText} className="col-lg-12" onChange={this.form.onChange}/>
                    {this.isLoggedUser && <hr />}
                    {this.isLoggedUser && <div className="row sec-group pos-relative padding-0 margin-0 min-h-50 margin-t-10">   
                        <div className="fixed-center margin-t-5">  
                            <Button className="btn btn-primary w-140" text="Change Password" onClick={this.onChangePassword}/>
                        </div>
                    </div>}
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="3. Module Permissions"
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <NewUserModulePermissions ref="modulePermissionsRef" selectedList={permissions_modules} readonly/>
                </Row>
            </div>
            {this.isLoggedUser && <EditPasswordDialog ref="editPasswordDialog" item={item}/>}
            {EditDialog && <EditDialog ref="editDialog"/>}
        </div>;
    }
    // </editor-fold>

}

export default ProfileDialog;
