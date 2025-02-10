// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable} from 'mobx';

import Form from 'utils/Form';
import {Dates, Permissions} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField, ProfilePic, SelectEmployeeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {
    NewUserModulePermissionsByClaim,
    NewUserModulePermissionsByExtra,
    NewUserModulePermissionsByHR,
    NewUserModulePermissionsBySHEQ,
    NewUserOtherPermissions
} from 'components/common-modules/ANewUserPermissions';

import EditPasswordDialog from "./EditPasswordDialog.js";

import style from "./ProfileDialog.lazy.css";
import NewClientListUpdateBlacklistTable from "components/FormTableComponents/NewClientListUpdateBlacklistTable";
import NewProjectListUpdateBlacklistTable from "components/FormTableComponents/NewProjectListUpdateBlacklistTable";
import NewSiteListUpdateBlacklistTable from "components/FormTableComponents/NewSiteListUpdateBlacklistTable";
import MKBox from "components/MK/MKBox";
import {updateContractorUser, updateEmployee, updateUser} from "mutations/update";
import Divider from "@mui/material/Divider";
import {findByIdUser} from "mutations/findById";
import {CircularProgress} from "@mui/material";
import findByIdContractorUser from "mutations/all/ContractorUser/findByIdContractorUser";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "User";

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {isContractor} = storage.is;
        return isContractor ? findByIdContractorUser : findByIdUser;
    }

    get removeById() {
        const {isContractor} = storage.is;
        const onUpdate = isContractor ? updateContractorUser : updateUser;
        if (!this.isOpen) return onUpdate;

        const {item} = this.state;
        if (!item) return null;

        return onUpdate;
    }

    get topButtonsHiddenEdit() {
        const {user} = storage.loggedUser;
        const {permissions_other_list} = user.data;
        const permissions_other_Users = (permissions_other_list || []).find(v => v.key.value === "Users");
        if (!this.isLoggedUser) {
            return !Permissions.allowEdit(permissions_other_Users);
        }
        return false;
    }

    get topButtonsHiddenDelete() {
        const {user} = storage.loggedUser;
        const {permissions_other_list} = user.data;
        const permissions_other_Users = (permissions_other_list || []).find(v => v.key.value === "Users");
        if (!Permissions.allowRemove(permissions_other_Users)) {
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

    onEdit(evt, btn) {
        const {editDialog} = this.refs.controls.refs;
        editDialog && editDialog.open(this.state.item);
    }

    title() {
        return this.isLoggedUser ? "My Profile" : "User Profile";
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            auth_type: [{
                text: "Multi-Factor Authentication (Password)",
                value: "MultiFactor",
                checked: true
            }, {text: "Biometric Authentication (Face)", value: "Biometric", checked: false}],
        },
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onUploaded = this.onUploaded.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onNewEmployee = this.onNewEmployee.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    get authTypeText() {
        const {item: {data: {auth_type = "MultiFactor"}}} = this;
        return this.state.lists.auth_type.find(v => v.value === auth_type).text;
    }

    @computed get item() {
        return this.props.state.item;
    }

    get isLoggedUser() {
        const {user} = storage.loggedUser;
        return this.item.id === user.id;
    }

    onUploaded(path) {
        extendObservable(this.item.data, {profile_pic: path});
        if (this.isLoggedUser) {
            const {user} = storage.loggedUser;
            user.profile_pic = path;
            storage.update.updateDBUser(storage.loggedUser);
        }
    }

    onChangePassword() {
        this.refs.editPasswordDialog.open(this.item).then(newPass => {
            this.item.password = newPass;
        });
    }

    onNewEmployee() {
        const {newEmployeeDialog} = this.refs;
        newEmployeeDialog && newEmployeeDialog.open().then(val => {
            this.refs.linkEmployee.employee = val;
        });
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {EditDialog, NewEmployeeDialog} = this.props.dialog.props;
//        console.log('this.props.dialog', this.props.dialog)

        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog, dialog: {close, renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    fname,
                    lname,
                    phone,
                    username,
                    password,
                    profile_pic,
                    auth_type = "MultiFactor",
                    //
                    notifications_settings = {},
                    //
                    linked_employee,
                    permissions_module_list,
                    permissions_other_list,
                    //
                    client,
                    project,
                    site,
                    contractor = {},
                    client_blacklist = [],
                    project_blacklist = [],
                    site_blacklist = [],
                }
            }
        } = this;

        const {name: contractorName} = contractor || {};

        const {
            receive_asset_management_notifs,
            receive_chemicals_management_notifs,
            receive_contractor_management_notifs,
            receive_employees_expired_docs_medicals,
            receive_employees_profile_notifs,
            receive_incident_management_notifs,
            receive_inspection_management_notifs,
            receive_non_conformance_management_notifs,
            receive_training_management_notifs,
            receive_expired_docs_notifs,
        } = notifications_settings || {};

        console.log(this.item)

        const {
            isConsultant,
            isContractor,
            isNoProjects,
            isClientBlacklisted,
            isProjectBlacklisted,
            isSiteBlacklisted
        } = storage.is;
        const path = isContractor ? "plugin_sheq_assist/contractors/users/upload/profile-pic" : "users/update/upload/profile-pic/user";

        const showBlacklisting = !isClientBlacklisted(client) && !isProjectBlacklisted(project) && !isSiteBlacklisted(site);

        const isLinkedEmployee = dialog.extraProp('linked_employee');

        let idx = 0;
        let idx_1 = 1;
        return <FormControls>
            {renderProfileCover(<React.Fragment>
                {!this.isLoggedUser && <ProfilePic readonly profilePic={profile_pic}/>}
                {this.isLoggedUser &&
                    <ProfilePic path={path} id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>}
                <h3>{fname + ' ' + lname}</h3>
                {created_at && <h5>{'Create On ' + Dates.formatDate(created_at)}</h5>}
            </React.Fragment>)}
            {isContractor && <Row
                active
                rendered
                idx={idx += 0.1}
                title="My Contractor Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <ProfileField title="Contractor Name" value={contractorName} className="col-lg-12"/>
            </Row>}
            {isContractor && <Row
                rendered
                idx={idx += 0.1}
                title="Company / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ProfileField title="Company" value={client} renderer={v => v.name}
                              className="col-lg-12"/>
                <ProfileField title="Site" value={site} renderer={v => v.name}
                              className="col-lg-12"/>
            </Row>}
            {!isContractor && !isNoProjects && <Row
                active={!isLinkedEmployee}
                rendered
                idx={idx += 1}
                title={idx + ". Company / Project / Site"}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <ProfileField title="Company" value={client} renderer={v => v.name}
                                               className="col-lg-12"/>}
                <ProfileField title="Project" value={project} renderer={v => v.name}
                              className="col-lg-12"/>
                <ProfileField title="Site" value={site} renderer={v => v.name} className="col-lg-12"/>
            </Row>}
            {showBlacklisting && <Row
                rendered
                active={isNoProjects}
                idx={'Blacklisting'}
                title={`${idx += 1}. Blacklisting`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNoProjects && onFormBack}
            >
                <FormControls>
                    {(isConsultant || isContractor) && !isClientBlacklisted(client) && <Row
                        rendered
                        idx={'BlacklistedCompanies'}
                        title={(idx + "." + idx_1) + ". Blacklisted Companies"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewClientListUpdateBlacklistTable
                            name="client_blacklist"
                            defaultValue={client_blacklist}
                            readonly
                        />
                    </Row>}
                    {!isContractor && !isProjectBlacklisted(project) && <Row
                        rendered
                        idx={'BlacklistedProjects'}
                        title={(idx + "." + (idx_1++)) + ". Blacklisted Projects"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <NewProjectListUpdateBlacklistTable
                            name="project_blacklist"
                            defaultValue={project_blacklist}
                            readonly
                        />
                    </Row>}
                    {!isSiteBlacklisted(project) && <Row
                        rendered
                        idx={'BlacklistedSites'}
                        title={(idx + "." + (idx_1++)) + ". Blacklisted Sites"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewSiteListUpdateBlacklistTable
                            name="site_blacklist"
                            defaultValue={site_blacklist}
                            readonly
                        />
                    </Row>}
                </FormControls>
            </Row>}
            <Row
                rendered
                idx={'UserDetails'}
                title={`${idx += isContractor ? 0.8 : 1}. User Details`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ProfileField title="First Name" ref="fname" name="fname" value={fname} className="col-lg-6"
                              onChange={this.form.onChange}/>
                <ProfileField title="Last Name" ref="lname" name="lname" value={lname} className="col-lg-6"
                              onChange={this.form.onChange}/>
                <ProfileField title="Phone Number" ref="phone" name="phone" value={phone} className="col-lg-12"
                              onChange={this.form.onChange}/>
            </Row>
            {!linked_employee && !isContractor && Permissions.hasModule('Employees') && <Row
                active={isLinkedEmployee}
                rendered
                idx={'LinkedEmployee'}
                title={`${idx += 1}. Link User To Employment Profile`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <LinkEmployee ref="linkEmployee" state={this.state} item={this.item} close={close}
                              onNewEmployee={this.onNewEmployee}/>
            </Row>}
            <Row
                rendered
                idx={'LoginDetails'}
                title={`${idx += 1}. Login Details`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ProfileField title="Username / Email Address" ref="username" name="username" type="email"
                              value={username} className="col-lg-12" onChange={this.form.onChange}/>
                <ProfileField title="Authentication Type" name="auth_type" value={this.authTypeText}
                              className="col-lg-12" onChange={this.form.onChange}/>
                {this.isLoggedUser && <hr/>}
                {this.isLoggedUser &&
                    <div className="row sec-group pos-relative padding-0 margin-0 min-h-50 margin-t-10">
                        <div className="fixed-center margin-t-5">
                            <Button className="btn btn-primary w-140" text="Change Password"
                                    onClick={this.onChangePassword}/>
                        </div>
                    </div>}
            </Row>
            <Row
                rendered
                idx={'NotificationsSettings'}
                title={`${idx += 1}. Notifications Settings`}
                onFormOpen={onFormOpen}
                onFormNext={!isContractor && onFormNext}
                onFormBack={onFormBack}
            >
                <ProfileField title="Receive Asset Management Notifications" name="receive_asset_management_notifs"
                              value={receive_asset_management_notifs ? 'Yes' : 'No'} className="col-lg-12"/>
                <ProfileField title="Receive Chemicals Management Notifications"
                              name="receive_chemicals_management_notifs"
                              value={receive_chemicals_management_notifs ? 'Yes' : 'No'} className="col-lg-12"/>
                <ProfileField title="Receive Contractor Management Notifications"
                              name="receive_contractor_management_notifs"
                              value={receive_contractor_management_notifs ? 'Yes' : 'No'} className="col-lg-12"/>
                <ProfileField title="Receive Employees Expired Documents Notifications"
                              name="receive_employees_expired_docs_medicals"
                              value={receive_employees_expired_docs_medicals ? 'Yes' : 'No'} className="col-lg-12"/>
                <ProfileField title="Receive Employees Profile Notifications" name="receive_employees_profile_notifs"
                              value={receive_employees_profile_notifs ? 'Yes' : 'No'} className="col-lg-12"/>
                <ProfileField title="Receive Incident Management Notifications"
                              name="receive_incident_management_notifs"
                              value={receive_incident_management_notifs ? 'Yes' : 'No'} className="col-lg-12"/>
                <ProfileField title="Receive Inspection Management Notifications"
                              name="receive_inspection_management_notifs"
                              value={receive_inspection_management_notifs ? 'Yes' : 'No'} className="col-lg-12"/>
                <ProfileField title="Receive Non-Conformance Management Notifications"
                              name="receive_non_conformance_management_notifs"
                              value={receive_non_conformance_management_notifs ? 'Yes' : 'No'} className="col-lg-12"/>
                <ProfileField title="Receive Training Management Notifications"
                              name="receive_training_management_notifs"
                              value={receive_training_management_notifs ? 'Yes' : 'No'} className="col-lg-12"/>

                <hr className="margin-0"/>

                <ProfileField title="Receive Expired Documents Notifications" name="receive_expired_docs_notifs"
                              value={receive_expired_docs_notifs ? 'Yes' : 'No'} className="col-lg-12"/>
            </Row>
            {!isContractor && <Row
                rendered
                idx={'Permissions'}
                title={`${idx += 1}. Permissions`}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={idx + 0.1}
                        title={idx + ".1. SHEQ Management Module Permissions"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewUserModulePermissionsBySHEQ selectedList={permissions_module_list} readonly/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + 0.2}
                        title={idx + ".2. HR Management Module Permissions"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <NewUserModulePermissionsByHR selectedList={permissions_module_list} readonly/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + 0.3}
                        title={idx + ".3. Claims Management Module Permissions"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <NewUserModulePermissionsByClaim selectedList={permissions_module_list} readonly/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + 0.4}
                        title={idx + ".4. Extra Module Permissions"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <NewUserModulePermissionsByExtra selectedList={permissions_module_list} readonly/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + 0.5}
                        title={idx + ".5. Other Permissions"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewUserOtherPermissions selectedList={permissions_other_list} readonly/>
                    </Row>
                </FormControls>
            </Row>}
            {this.isLoggedUser && <EditPasswordDialog ref="editPasswordDialog" item={item}/>}
            {!linked_employee && NewEmployeeDialog && !isContractor &&
                <NewEmployeeDialog ref="newEmployeeDialog"/>}
            {EditDialog && <EditDialog ref="editDialog"/>}
        </FormControls>;
    }

    // </editor-fold>

}

//<editor-fold desc="LinkEmployee">
@observer
class LinkEmployee extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        employee: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.form = new Form();
        this.form.addChangeOne("employee", this.onChangeEmployee.bind(this));
    }

    // </editor-fold>

    @computed get employee() {
        return this.state.employee;
    }

    set employee(val) {
        this.state.employee = val;
    }

    onChangeEmployee(el, val) {
        this.state.employee = val;
    }

    render() {
        const {item, onNewEmployee} = this.props;

        return <>
            <SelectEmployeeInput
                name="employee"
                placeholder="Select Existing Employee..."
                className="col-lg-12 margin-b-10 form-control"
                onChange={this.form.onChange}
            />
            <h3 className="hor-center margin-t-15 margin-b-0 padding-r-10 fixed-flex">OR</h3>
            <Button
                className="btn btn-primary hor-center margin-t-10 h-35 fixed-flex"
                text="Create New Employee"
                onClick={onNewEmployee}
            />
            <MKBox
                sx={{
                    background: '#f5f5f5',
                    boxShadow: '0 0 3px #ddd',
                    borderRadius: '3px',
                    p: '10px',
                    m: '20px 20px 10px 10px',
                }}
            >
                <label className="text-center bg-white w-full padding-10 font-size-15">Selected Employee Details</label>
                <SelectedEmployee state={this.state} item={item} close={this.props.close}/>
            </MKBox>
        </>;
    }
}

//</editor-fold>

//<editor-fold desc="SelectedEmployee">
@observer
class SelectedEmployee extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onUpdateEmployee = this.onUpdateEmployee.bind(this);
    }

    // </editor-fold>

    @computed get employee() {
        return this.props.state.employee;
    }


    //<editor-fold desc="onUpdateEmployee">
    onUpdateEmployee(e, btn) {
        btn.text("Saving...").disabled();
        const {id: linked_employee_id} = this.employee;
        const {item} = this.props;
        const linked_user_id = item.id;
        updateUser({id: linked_user_id, linked_employee_id}).then(resUser => {
            return updateEmployee({id: linked_employee_id, linked_user_id}).then(resEmployee => {
                return {resUser, resEmployee};
            });
        }).then(res => {
            if (!res) {
                infoDialog.open("Couldn't complete the action. Please try again later.");
                return;
            }

            const {resUser, resEmployee} = res;

            extendObservable(item.data, resUser.data);

            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close && this.props.close();
        }).finally(() => {
            btn.text("Link To Employee Details").enabled();
        });
    }

    render() {
        const {employee} = this;
        if (!employee) {
            return <p className="margin-t-10 hor-center text-center">
                No Employee Selected<br/>Please add/select an employee from the above options
            </p>;
        }

        const {data: {full_name, id_num, passport_num, phone, email}} = employee;

        return <>
            <div className="margin-t-10 hor-center text-center font-size-18">
                {full_name}<br/>
                ID/Passport No. ({id_num || passport_num})<br/>
                Phone No. ({phone || 'N/A'})<br/>
                Email Address ({email || 'N/A'})
                <Divider/>
            </div>
            <Button
                className="btn btn-primary margin-t-10 margin-b-5 hor-center h-35"
                text="Link To Employee Details"
                onClick={this.onUpdateEmployee}
            />
        </>;
    }
}

//</editor-fold>
//</editor-fold>

export default ProfileDialog;
