// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../utils/Form';
import {Dates, Permissions} from '../../../utils/Utils';
import {AProfileDialog} from '../../../components/dialogs';
import {Button, ProfileField, ProfilePic, SelectEmployeeInput} from '../../../components/inputs';
import {Row} from '../../../components/FormComponents';

import {
    NewUserModulePermissions,
    NewUserOtherPermissions
} from '../../../components/common-modules/ANewUserPermissions';

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
        const {permissions_other} = user.data;
        const permissions_other_Users = (permissions_other || []).find(v => v.key === "Users");
        if(!this.isLoggedUser) {
            return !Permissions.allowEdit(permissions_other_Users);
        }
        return false;
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
        return  Controls;
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
        },
        employee: null
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.path = storage.is.isContractor ? 'plugin_sheq_assist/contractors/users/' : 'users/update/';
        
        this.onUploaded = this.onUploaded.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        
        this.onNewEmployee = this.onNewEmployee.bind(this);
        this.onUpdateEmployee = this.onUpdateEmployee.bind(this);

        this.form = new Form();
        this.form.addChangeOne("employee", this.onChangeEmployee.bind(this));    
    }
    // </editor-fold>
    
    onChangeEmployee(el, val) {
        this.state.employee = val;
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
    
    onNewEmployee() {
        const {newEmployeeDialog} = this.refs;
        newEmployeeDialog && newEmployeeDialog.open().then(val => {
            this.state.employee = val;
        });
    }
    
    onUpdateEmployee(e, btn) {
        btn.text("Saving...").disabled();
        const {id: linked_employee_id} = this.state.employee;
        neonBinding.events.emit(this.path + "update", this.item.id, {linked_employee_id}).then(res => {
            this.item.data.linked_employee_id = linked_employee_id;
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Create New Employee").enabled();
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
        const {EditDialog, NewEmployeeDialog} = this.props.dialog.props;
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
                    receive_expired_docs_notifs, 
                    linked_employee_id,
                    permissions_modules, permissions_other,
                    client, project, site, contractor = {}
                }
            }
        } = this;
        
        const {data = {}} = contractor;
        const {name} = data;
        
        console.log(this.item)
        
        const path = storage.is.isContractor ? "plugin_sheq_assist/contractors/users/upload/profile-pic" : "users/update/upload/profile-pic/user";
        
        let idx = 0;
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    {!this.isLoggedUser && <ProfilePic readonly profilePic={profile_pic}/>}
                    {this.isLoggedUser && <ProfilePic path={path} id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>}
                    <h3>{fname + ' ' + lname}</h3>
                    {created_at && <h5>{'Create On ' + Dates.formatDate(created_at)}</h5>}
                </React.Fragment>)}
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
                    <ProfileField title="Company" value={client} renderer={v => v.name || v.data.name} className="col-lg-12"/>
                    <ProfileField title="Project" value={project} renderer={v => v.name || v.data.name} className="col-lg-6"/>
                    <ProfileField title="Site" value={site} renderer={v => v.name || v.data.name} className="col-lg-6"/>
                </Row>}
                <Row 
                    rendered 
                    idx={idx += storage.is.isContractor ? 0.8 : 1} 
                    title={idx + ". User Details"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfileField title="First Name" ref="fname" name="fname" value={fname} className="col-lg-6" onChange={this.form.onChange}/>
                    <ProfileField title="Last Name" ref="lname" name="lname" value={lname} className="col-lg-6" onChange={this.form.onChange}/>
                    {this.isLoggedUser && <ProfileField title="Phone Number" ref="phone" name="phone" value={phone} className="col-lg-12" onChange={this.form.onChange}/>}
                </Row>
                {!linked_employee_id && <Row 
                    rendered 
                    idx={idx += 1} 
                    title={idx + ". Link User To Employee Details"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <SelectEmployeeInput name="employee" placeholder="Select Existing Employee..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <h3 className="hor-center margin-t-15 margin-b-0 padding-r-10 fixed-flex">OR</h3>
                    <Button className="btn btn-primary margin-t-10  h-35 fixed-flex" text="Create New Employee" onClick={this.onNewEmployee}/>
                    <div className="min-w-10 fixed-flex"></div>
                    
                    <label className="margin-t-10">Selected Employee Details</label>
                    {!this.state.employee && <p>No Employee Selected<br/>Please add/select an employee from the above options</p>}
                    {this.state.employee && <div>
                        {this.state.employee.data.lname + ' ' + this.state.employee.data.fname}
                    </div>}
                    {this.state.employee && <Button className="btn btn-primary margin-t-10 hor-center h-35" text="Link To Employee Details" onClick={this.onUpdateEmployee}/>}
                </Row>}
                <Row 
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Login Details"} 
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
                    idx={idx += 1}
                    title={idx + ". Notifications Settings"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfileField title="Receive Expired Documents Notifications" name="receive_expired_docs_notifs" value={receive_expired_docs_notifs ? 'Yes' : 'No'} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Module Permissions"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <NewUserModulePermissions ref="modulePermissionsRef" selectedList={permissions_modules} readonly/>
                </Row>
                <Row 
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Other Permissions"} 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <NewUserOtherPermissions ref="otherPermissionsRef" selectedList={permissions_other} readonly/> 
                </Row>
            </div>
            {this.isLoggedUser && <EditPasswordDialog ref="editPasswordDialog" item={item}/>}
            {!linked_employee_id && NewEmployeeDialog && <NewEmployeeDialog ref="newEmployeeDialog" path={this.path}/>}
            {EditDialog && <EditDialog ref="editDialog"/>}
        </div>;
    }
    // </editor-fold>

}

export default ProfileDialog;
