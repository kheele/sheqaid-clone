// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable} from 'mobx';

import Form from 'utils/Form';

import {Permissions, ShouldUpdate} from 'utils/Utils';
import {
    Button,
    ClearableInput,
    ProfileField,
    ProfilePic,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import {
    NewUserModulePermissions,
    NewUserOtherPermissions
} from 'components/common-modules/ANewUserPermissions';

import EditPasswordDialog from "./EditPasswordDialog.js";

import style from "./EditDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "User";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return this.isLoggedUser ? "Edit My Profile" : "Edit User Profile";
    }
    
    get topButtonsHiddenDelete() {
        const {user} = storage.loggedUser;
        const {permissions_other} = user.data;
        const permissions_other_Users = (permissions_other || []).find(v => v.key === "Users");
        if(!Permissions.allowRemove(permissions_other_Users)) {
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
        return Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            auth_type: [{text: "Multi-Factor Authentication (Password)", value: "MultiFactor", checked: true}, {text: "Biometric Authentication (Face)", value: "Biometric", checked: false}],
            receive_expired_docs_notifs: [{text: "Receive Expired Documents Notifications", value: true, checked: false}],
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.path = storage.is.isContractor ? 'plugin_sheq_assist/contractors/users/' : 'users/update/'; 
        
        this.onNext = this.onNext.bind(this);
        
        this.onSelectAllModulePermissions = this.onSelectAllModulePermissions.bind(this);
        this.onClearAllModulePermissions = this.onClearAllModulePermissions.bind(this);
        this.onSelectAllOtherPermissions = this.onSelectAllOtherPermissions.bind(this);
        this.onClearAllOtherPermissions = this.onClearAllOtherPermissions.bind(this);
        
        this.onUploaded = this.onUploaded.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="funs">
    onSelectAllModulePermissions() {
        const {refs: {modulePermissionsRef}} = this;
        modulePermissionsRef.selectAll();
    }
    
    onClearAllModulePermissions() {
        const {refs: {modulePermissionsRef}} = this;
        modulePermissionsRef.unselectAll();
    }
    
    onSelectAllOtherPermissions() {
        const {refs: {otherPermissionsRef}} = this;
        otherPermissionsRef.selectAll();
    }
    
    onClearAllOtherPermissions() {
        const {refs: {otherPermissionsRef}} = this;
        otherPermissionsRef.unselectAll();
    }
    
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
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 2) {
            const {employee} = this.state;
            if (!employee && !form.isValid('fname')) {
                infoDialog.open('First Name is required');
                return;
            }
            if (!employee && !form.isValid('lname')) {
                infoDialog.open('Last Name is required');
                return;
            }
            if (!form.isValid('phone')) {
                infoDialog.open('Phone No. required');
                return;
            }
        }
        if(idx === 3) {
            if (!form.isValid('username')) {
                infoDialog.open('Email Address is required');
                return;
            } else if (!form.get('username').isEmailAddress()) {
                infoDialog.open('Email Address is not valid');
                return;
            }
            if (!form.isValid('auth_type')) {
                infoDialog.open('Authentication Type is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        //2
        if (!form.isValid('fname')) {
            infoDialog.open('First Name is required');
            return;
        }
        if (!form.isValid('lname')) {
            infoDialog.open('Last Name is required');
            return;
        }
        if (!form.isValid('phone')) {
            infoDialog.open('Phone No. required');
            return;
        }
        
        //3
        if (!form.isValid('username')) {
            infoDialog.open('Email Address is required');
            return;
        } else if (!form.get('username').isEmailAddress()) {
            infoDialog.open('Email Address is not valid');
            return;
        }
        if (!form.isValid('auth_type')) {
            infoDialog.open('Authentication Type is required');
            return;
        }
        
        const {
            fname, lname, phone, username, auth_type,
            receive_expired_docs_notifs, 
            site, project, client,
            permissions_modules, permissions_other
        } = form.data;
        const data = {};
        ShouldUpdate.check(data, old_data, fname, 'fname');
        ShouldUpdate.check(data, old_data, lname, 'lname');  
        ShouldUpdate.check(data, old_data, phone, 'phone');
        ShouldUpdate.check(data, old_data, username, 'username');
        ShouldUpdate.check(data, old_data, auth_type, 'auth_type');
        
        ShouldUpdate.checkBox(data, old_data, receive_expired_docs_notifs, 'receive_expired_docs_notifs');
           
        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);
        
        ShouldUpdate.checkListToJS(data, old_data, permissions_modules, 'permissions_modules');
        ShouldUpdate.checkListToJS(data, old_data, permissions_other, 'permissions_other');
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            site && (data.site = site);
            project && (data.project = project);
            client && (data.client = client);
            if(data.site === 'All') {
                delete data.site;
            }
            if(data.project === 'All') {
                delete data.project;
            }
            if(data.client === 'All') {
                delete data.client;
            }
            onSaved && onSaved(data);
            const {user} = storage.loggedUser;
            if(user.id === this.item.id) {
                extendObservable(user.data, data);
                storage.update.updateDBUser(storage.loggedUser);
            }
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>
        
    get item() {
        return this.props.state.item;
    }

    get isLoggedUser() {
        const {user} = storage.loggedUser;
        return this.item.id === user.id;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at, profile_pic,
                    fname, lname, phone, username, password,
                    auth_type = "MultiFactor",
                    receive_expired_docs_notifs, 
                    permissions_modules, permissions_other,
                    client, project, site, contractor = {} 
                }
            }
        } = this;
        
        const {data = {}} = contractor;
        const {name} = data;
        
        console.log(this.item)
        
        setTimeout(() => {
            this.state.lists.receive_expired_docs_notifs[0].checked = !!receive_expired_docs_notifs;
        }, 0);
        
        const path = this.path + (storage.is.isContractor ? "upload/profile-pic" : "upload/profile-pic/user");
        
        let idx = 0;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls"> 
                {storage.is.isContractor && <Row 
                    active
                    rendered 
                    idx={idx += 0.1}
                    title="My Contractor Details" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <ProfileField title="Name" value={name} className="col-lg-12"/>
                </Row>}
                {storage.is.isContractor && <Row 
                    rendered 
                    idx={idx += 0.1}
                    title="Company Details" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfileField title="Company" value={client} renderer={v => v.name || v.data.name} className="col-lg-6"/>
                    <ProfileField title="Project" value={project} renderer={v => v.name || v.data.name} className="col-lg-6"/>
                </Row>}
                {!storage.is.isContractor && <Row 
                    active
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Company Details"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <SelectClientInput name="client" placeholder="Company..." showAll defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectProjectInput name="project" placeholder="Project..." showAll defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." showAll defaultValue={RenderUtils.selectedSite.call(this)} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                </Row>}
                <Row 
                    rendered 
                    idx={idx += storage.is.isContractor ? 0.8 : 1} 
                    title={idx + ". User Details"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfilePic path={path} id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>
                    <ClearableInput name="fname" type="text" placeholder="First Name" defaultValue={fname} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="lname" type="text" placeholder="Last Name" defaultValue={lname} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="phone" type="text" placeholder="Phone No." defaultValue={phone} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Login Details"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="username" type="email" placeholder="Username / Email Address" defaultValue={username} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="auth_type" type="radio" placeholder="Authentication Type" defaultValue={auth_type} required vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.auth_type}/>
                    {this.isLoggedUser && <hr />}
                    {this.isLoggedUser && <div className="row sec-group pos-relative padding-0 margin-0 min-h-50 margin-t-10">   
                        <div className="fixed-center margin-t-5">  
                            <Button className="btn btn-primary w-140" text="Change Password" onClick={this.onChangePassword}/>
                        </div>
                    </div>}
                </Row>
                <Row 
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Notifications Settings"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="receive_expired_docs_notifs" type="checkbox" defaultValue={receive_expired_docs_notifs} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.receive_expired_docs_notifs} returnValue/>
                </Row>
                <Row 
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Module Permissions"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5" text="Select All" onClick={this.onSelectAllModulePermissions}/>
                    <Button className="btn btn-primary pull-right padding-5" text="Clear All" onClick={this.onClearAllModulePermissions}/>
                    <hr />
                    <NewUserModulePermissions ref="modulePermissionsRef" name="permissions_modules" selectedList={permissions_modules} onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Other Permissions"} 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5" text="Select All" onClick={this.onSelectAllOtherPermissions}/>
                    <Button className="btn btn-primary pull-right padding-5" text="Clear All" onClick={this.onClearAllOtherPermissions}/>
                    <hr />
                    <NewUserOtherPermissions ref="otherPermissionsRef" name="permissions_other" selectedList={permissions_other} onChange={this.form.onChange}/>
                </Row>
            </div>
            {this.isLoggedUser && <EditPasswordDialog ref="editPasswordDialog" item={item}/>}
        </div>);
    }
    // </editor-fold>
}

export default EditDialog;