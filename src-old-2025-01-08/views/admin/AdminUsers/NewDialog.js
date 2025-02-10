// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {Button, ClearableInput, ProfilePic} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';
import {NewUserModulePermissions} from 'components/common-modules/ANewUserPermissions';

import style from "./NewDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "User";
    title = "Create User";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = 'admin/users/accounts/';
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            auth_type: [{text: "Multi-Factor Authentication (Password)", value: "MultiFactor", checked: true}, {text: "Biometric Authentication (Face)", value: "Biometric", checked: false}],
        }
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onNext = this.onNext.bind(this);
        
        this.onSelectAllModulePermissions = this.onSelectAllModulePermissions.bind(this);
        this.onClearAllModulePermissions = this.onClearAllModulePermissions.bind(this);
        this.onSelectAllOtherPermissions = this.onSelectAllOtherPermissions.bind(this);
        this.onClearAllOtherPermissions = this.onClearAllOtherPermissions.bind(this);
        
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
    // </editor-fold>
 
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
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
        }
        if(idx === 2) {
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
        const {form} = this;

        //1
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
        
        //2
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
            profile_pic, fname, lname, phone, username, auth_type,
            permissions_modules
        } = form.data;
        const data = {
            fname, lname, phone, username, auth_type
        };
        
        if(profile_pic) {
            data.profile_pic = profile_pic.path ? profile_pic.path : profile_pic;
        }
                
        if (permissions_modules) {
            data.permissions_modules = toJS(permissions_modules);
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + 'create', data).then(res => {
            console.log("res", res)
            if (res === "EMAIL_DUP") {
                infoDialog.open("A User with this email address already exist.");
            } else {
                onSaved && onSaved(res);
                infoDialog.open("Record successfully saved.");
                infoDialog.close(2000);
                this.props.close();
            }
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row 
                    active
                    rendered 
                    idx={1} 
                    title="1. User Details" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfilePic ref="profile_pic" name="profile_pic" onChange={this.form.onChange}/>
                    <ClearableInput ref="fname" name="fname" type="text" placeholder="First Name" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="lname" name="lname" type="text" placeholder="Last Name" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="phone" name="phone" type="text" placeholder="Phone No." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Login Details"  
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput ref="username" name="username" type="email" placeholder="Username / Email Address" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="auth_type" type="radio" placeholder="Authentication Type" required vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.auth_type}/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="3. Module Permissions"
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5" text="Select All" onClick={this.onSelectAllModulePermissions}/>
                    <Button className="btn btn-primary pull-right padding-5" text="Clear All" onClick={this.onClearAllModulePermissions}/>
                    <hr />
                    <NewUserModulePermissions ref="modulePermissionsRef" name="permissions_modules" onChange={this.form.onChange}/>
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default NewDialog;
