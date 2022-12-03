// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../utils/Form';

import {
    Button,
    ClearableInput,
    ProfileField,
    ProfilePic,
    SelectClientInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../components/inputs';
import {Row} from '../../../components/FormComponents';
import {ANewDialog} from '../../../components/dialogs';
import {
    NewUserModulePermissions,
    NewUserOtherPermissions
} from '../../../components/common-modules/ANewUserPermissions';

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
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            auth_type: [{text: "Multi-Factor Authentication (Password)", value: "MultiFactor", checked: true}, {text: "Biometric Authentication (Face)", value: "Biometric", checked: false}],
            receive_expired_docs_notifs: [{text: "Receive Expired Documents Notifications", value: true, checked: false}],
        },
        employee: null
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        
        this.onSelectAllModulePermissions = this.onSelectAllModulePermissions.bind(this);
        this.onClearAllModulePermissions = this.onClearAllModulePermissions.bind(this);
        this.onSelectAllOtherPermissions = this.onSelectAllOtherPermissions.bind(this);
        this.onClearAllOtherPermissions = this.onClearAllOtherPermissions.bind(this);
        
        this.onChangeNames = this.onChangeNames.bind(this);
        this.form.addChangeMany(["fname", "lname"], this.onChangeNames);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="funs">
    onChangeNames(el, name, val) {
        const {profile_pic: ref_profile_pic, fname: ref_fname, lname: ref_lname, phone: ref_phone, username: ref_username} = this.refs;
        if(isString(val) && !this.employeeTO) {
            console.log('onChangeNames', name, val)
            if(this.state.employee) {
                name !== 'fname' && ref_fname.reset();
                name !== 'lname' && ref_lname.reset();
                ref_phone.reset();
                ref_username.reset();
            }
            this.state.employee = null;
        } else if(!this.employeeTO) {
            this.employeeTO = setTimeout(() => {
                clearTimeout(this.employeeTO);
                this.employeeTO = null;
            }, 500);
            
            this.state.employee = val;
            if(val) {
                const {profile_pic, fname, lname, id_num, passport_num, site, project, client, access_type, phone, email} = val.data;
                profile_pic && ref_profile_pic.setValue(profile_pic);
                fname && ref_fname.onChange(fname);
                lname && ref_lname.onChange(lname);
                phone && ref_phone.onChange(phone);
                email && ref_username.onChange(email);
            } else {
                
            }
        }
    }
    
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
        const {form, isNewContractorUser, contractor} = this;
        const path = storage.is.isContractor ? "plugin_sheq_assist/contractors/users/create" : 
                isNewContractorUser ? "plugin_sheq_assist/contractors/users/signup" : "users/accounts/create";

        //2
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
            profile_pic, fname, lname, phone, username, auth_type,
            receive_expired_docs_notifs,
            site, project, client, permissions_modules, permissions_other
        } = form.data;
        const data = {
            fname, lname, phone, username, auth_type
        };
        
        if(receive_expired_docs_notifs) {
            data.receive_expired_docs_notifs = receive_expired_docs_notifs;
        } else {
            data.receive_expired_docs_notifs = false;
        }
        
        if(employee) {
            data.linked_employee_id = employee.id;
            data.fname = employee.data.fname;
            data.lname = employee.data.lname;
        }
        if(profile_pic) {
            data.profile_pic = profile_pic.path ? profile_pic.path : profile_pic;
        }
        
        if(isNewContractorUser) {
            data.contractor = contractor;
        } else {
            if(site) {
                if(site.id) {
                    const {id, data: _data, name} = site;
                    data.site = {id, name: name || _data.name};
                } else {
                    data.site = site;
                }
            }  
            if(project) {
                if(project.id) {
                    const {id, data: _data, name} = project;
                    data.project = {id, name: name || _data.name};
                } else {
                    data.project = project;
                }
            }
            if(client) {
                if(client.id) {
                    const {id, data: _data, name} = client;
                    data.client = {id, name: name || _data.name};
                } else {
                    data.client = client;
                }
            }
        }
        
        if (permissions_modules) {
            data.permissions_modules = toJS(permissions_modules);
        }
        if (permissions_other) {
            data.permissions_other = toJS(permissions_other);
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(path, data).then(res => {
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
    
    get isNewContractorUser() {
        const {props: {dialog: {props: {isNewContractorUser}}}} = this;
        return isNewContractorUser;
    }
    
    get contractor() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {isNewContractorUser, contractor = {}} = this;
        const {data = {}} = contractor || {};
        const {name, client, project} = data;
        const isContractorAcc = isNewContractorUser || storage.is.isContractor;
        let idx = 0;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {isContractorAcc && <Row 
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
                {!isContractorAcc && <Row 
                    active
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Company Details"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <SelectClientInput name="client" placeholder="Company..." required showAll className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectProjectInput name="project" placeholder="Project..." required showAll className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." required showAll className="col-lg-6 form-control" onChange={this.form.onChange}/>
                </Row>}
                <Row 
                    rendered 
                    idx={idx += isNewContractorUser ? 0.9 : storage.is.isContractor ? 0.8 : 1} 
                    title={idx + ". User Details"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfilePic ref="profile_pic" name="profile_pic" onChange={this.form.onChange}/>
                    <SelectEmployeeInput ref="fname" name="fname" placeholder="First Name" footerDesc="enter existing employee" required className="col-lg-6 form-control" onChange={this.form.onChange} add/>
                    <SelectEmployeeInput ref="lname" name="lname" placeholder="Last Name" footerDesc="enter existing employee" required className="col-lg-6 form-control" onChange={this.form.onChange} add/>
                    <ClearableInput ref="phone" name="phone" type="text" placeholder="Phone No." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Login Details"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput ref="username" name="username" type="email" placeholder="Username / Email Address" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="auth_type" type="radio" placeholder="Authentication Type" required vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.auth_type}/>
                </Row>
                <Row 
                    rendered 
                    idx={idx += 1}
                    title={idx + ". Notifications Settings"} 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="receive_expired_docs_notifs" type="checkbox" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.receive_expired_docs_notifs} returnValue/>
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
                    <NewUserModulePermissions ref="modulePermissionsRef" name="permissions_modules" onChange={this.form.onChange}/>
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
                    <NewUserOtherPermissions ref="otherPermissionsRef" name="permissions_other" onChange={this.form.onChange}/>
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default NewDialog;
