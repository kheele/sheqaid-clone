// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {onChangeUsername} from 'utils/UsersFuns';

import {debounce, execWhen} from 'utils/Utils';
import {
    Button,
    ClearableInput, ProfilePic,
    SelectClientInput, SelectCountryCodeInput,
    SelectProjectInput,
    SelectSiteInput,
    UsernameStatus
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {
    NewUserModulePermissions,
    NewUserModulePermissionsByClaim, NewUserModulePermissionsByExtra,
    NewUserModulePermissionsByHR,
    NewUserModulePermissionsBySHEQ,
    NewUserOtherPermissions
} from 'components/common-modules/ANewUserPermissions';

import UserDetails from "./UserDetails.js";
import NewClientListUpdateBlacklistTable
    from "components/FormTableComponents/NewClientListUpdateBlacklistTable";
import NewProjectListUpdateBlacklistTable
    from "components/FormTableComponents/NewProjectListUpdateBlacklistTable";
import NewSiteListUpdateBlacklistTable
    from "components/FormTableComponents/NewSiteListUpdateBlacklistTable";
import insertUser from "mutations/all/User/insertUser";

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
            //
            receive_asset_management_notifs: [{
                text: "Receive Asset Management Notifications",
                value: true,
                checked: false
            }],
            receive_chemicals_management_notifs: [{
                text: "Receive Chemicals Management Notifications",
                value: true,
                checked: false
            }],
            receive_contractor_management_notifs: [{
                text: "Receive Contractor Management Notifications",
                value: true,
                checked: false
            }],
            receive_employees_expired_docs_medicals: [{
                text: "Receive Employees Expired Documents Notifications",
                value: true,
                checked: false
            }],
            receive_employees_profile_notifs: [{
                text: "Receive Employees Profile Notifications",
                value: true,
                checked: false
            }],
            receive_incident_management_notifs: [{
                text: "Receive Incident Management Notifications",
                value: true,
                checked: false
            }],
            receive_non_conformance_management_notifs: [{
                text: "Receive Non-Conformance Management Notifications",
                value: true,
                checked: false
            }],
            receive_training_management_notifs: [{
                text: "Receive Training Management Notifications",
                value: true,
                checked: false
            }],
            //
            receive_expired_docs_notifs: [{
                text: "Receive Expired Documents Notifications",
                value: true,
                checked: false
            }],
        },
        employee: null,
        usernameStatus: {
            valid: false,
            required: true,
            exist: false,
            duplicate: false,
            uid: null,
            token: null,
            loading: false,
            username: null
        }
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

        this.onChangeUsernameStatus = this.onChangeUsernameStatus.bind(this);

        this.form.addChangeOne("username", debounce(onChangeUsername.call(this, "User")).bind(this));
        this.form.addChangeMany(["fname", "lname"], this.onChangeNames);
    }

    // </editor-fold>

    //<editor-fold desc="onChangeUsernameStatus">
    onChangeUsernameStatus(status) {
        const {dialog} = this.props;
        execWhen(() => /*this.refs.signup && */this.refs.usernameStatus && this.refs.userDetails).then(() => {
            const {/*signup, */usernameStatus, userDetails} = this.refs;
            const {cancel, submit} = dialog.refs;
            if (status.status === 'CONFIRMED' || (usernameStatus && usernameStatus.isAvailable)) {
                // signup.show();
                //
                if (usernameStatus.isAvailable) {
                    userDetails.showPasswords();
                    submit.show();
                } else {
                    submit.hide();
                }
            } else if (usernameStatus && usernameStatus.isRequired) {
                submit.show();
            } else {
                // signup.hide();
                submit.hide();
            }
        });
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="funs">
    onChangeNames(el, name, val) {
        const {
            username: ref_username,
            userDetails: {
                refs: {
                    fname: ref_fname,
                    lname: ref_lname,
                    profile_pic: ref_profile_pic,
                }
            },
        } = this.refs;
        if (isString(val) && !this.employeeTO) {
            console.log('onChangeNames', name, val)
            if (this.state.employee) {
                name !== 'fname' && ref_fname.reset();
                name !== 'lname' && ref_lname.reset();
                ref_username.reset();
            }
            this.state.employee = null;
        } else if (!this.employeeTO) {
            this.employeeTO = setTimeout(() => {
                clearTimeout(this.employeeTO);
                this.employeeTO = null;
            }, 500);

            this.state.employee = val;
            if (val) {
                const {
                    profile_pic,
                    fname,
                    lname,
                    id_num,
                    passport_num,
                    site,
                    project,
                    client,
                    access_type,
                    email
                } = val.data;
                profile_pic && ref_profile_pic.setValue(profile_pic);
                fname && ref_fname.onChange(fname);
                lname && ref_lname.onChange(lname);
                email && ref_username.onChange(email);
            } else {

            }
        }
    }

    onSelectAllModulePermissions(evt, btn) {
        const {actionRef} = btn.props;
        const {refs: {[actionRef]: ref}} = this;
        ref.selectAll();
    }

    onClearAllModulePermissions(evt, btn) {
        const {actionRef} = btn.props;
        const {refs: {[actionRef]: ref}} = this;
        ref.unselectAll();
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

        if (idx === 'LoginDetails') {
            const {employee} = this.state;

            if (!form.isValid('username')) {
                infoDialog.open('Username / Email Address is required');
                return;
            } else if (!form.get('username').isEmailAddress()) {
                infoDialog.open('Username / Email Address is not valid');
                return;
            }
//                if (!form.isValid('auth_type')) {
//                    infoDialog.open('Authentication Type is required');
//                    return;
//                }

            if (!employee && !form.isValid('fname')) {
                infoDialog.open('First Name is required');
                return;
            }
            if (!employee && !form.isValid('lname')) {
                infoDialog.open('Last Name is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form} = this;
        const path = "users/accounts/create";

        //2
        if (!form.isValid('username')) {
            infoDialog.open('Username / Email Address is required');
            return;
        } else if (!form.get('username').isEmailAddress()) {
            infoDialog.open('Username / Email Address is not valid');
            return;
        }
        const {employee} = this.state;
        if (!employee && !form.isValid('fname')) {
            infoDialog.open('First Name is required');
            return;
        }
        if (!employee && !form.isValid('lname')) {
            infoDialog.open('Last Name is required');
            return;
        }

        //3
//        if (!form.isValid('auth_type')) {
//            infoDialog.open('Authentication Type is required');
//            return;
//        }

        const {
            profile_pic,
            fname,
            lname,
            username,
            auth_type = 'MultiFactor',
            //
            receive_asset_management_notifs,
            receive_chemicals_management_notifs,
            receive_contractor_management_notifs,
            receive_employees_expired_docs_medicals,
            receive_employees_profile_notifs,
            receive_incident_management_notifs,
            receive_non_conformance_management_notifs,
            receive_training_management_notifs,
            receive_expired_docs_notifs,
            //
            site,
            project,
            client,
            blacklisted_client_list,
            blacklisted_project_list,
            blacklisted_site_list,
            permissions_modules_sheq,
            permissions_modules_hr,
            permissions_modules_claims,
            permissions_modules_extra,
            permissions_other_list
        } = form.data;

        // console.log('permissions_modules_sheq', permissions_modules_sheq);
        // console.log('permissions_modules_hr', permissions_modules_hr);
        // console.log('permissions_modules_claims', permissions_modules_claims);
        // console.log('permissions_modules_extra', permissions_modules_extra);

        let __permissions_modules_sheq = [];
        let __permissions_modules_hr = [];
        let __permissions_modules_claims = [];
        let __permissions_modules_extra = [];
        if (permissions_modules_sheq) {
            __permissions_modules_sheq = permissions_modules_sheq.list || permissions_modules_sheq;
        }
        if (permissions_modules_hr) {
            __permissions_modules_hr = permissions_modules_hr.list || permissions_modules_hr;
        }
        if (permissions_modules_claims) {
            __permissions_modules_claims = permissions_modules_claims.list || permissions_modules_claims;
        }
        if (permissions_modules_extra) {
            __permissions_modules_extra = permissions_modules_extra.list || permissions_modules_extra;
        }

        // console.log('permissions_other_list', permissions_other_list);
        let __permissions_other_list = [];
        if (permissions_other_list) {
            __permissions_other_list = permissions_other_list.list || permissions_other_list;
        }

        const data = {
            profile_pic: profile_pic && profile_pic.path,
            fname,
            lname,
            username: username.toLowerCase(),
            auth_type,
            linked_employee_id: employee && employee.id,
            site_id: site && site.id,
            project_id: project && project.id,
            client_id: client && client.id,
            blacklisted_client_list: {data: (blacklisted_client_list || []).map(({id: client_id}) => ({client_id}))},
            blacklisted_project_list: {data: (blacklisted_project_list || []).map(({id: project_id}) => ({project_id}))},
            blacklisted_site_list: {data: (blacklisted_site_list || []).map(({id: site_id}) => ({site_id}))},
            notifications_settings: {
                data: {
                    receive_asset_management_notifs,
                    receive_chemicals_management_notifs,
                    receive_contractor_management_notifs,
                    receive_employees_expired_docs_medicals,
                    receive_employees_profile_notifs,
                    receive_incident_management_notifs,
                    receive_non_conformance_management_notifs,
                    receive_training_management_notifs,
                    receive_expired_docs_notifs,
                }
            },
            permissions_module_list: {
                data: [
                    ...__permissions_modules_sheq,
                    ...__permissions_modules_hr,
                    ...__permissions_modules_claims,
                    ...__permissions_modules_extra,
                ].map(({module, actions}) => ({module_id: convertIdToBigint(module.id), actions: {data: {...actions}}}))
            },
            permissions_other_list: {
                data: __permissions_other_list
                    .map(({key, actions}) => ({key_id: convertIdToBigint(key.id), actions: {data: {...actions}}}))
            },
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertUser(data).then(res => {
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
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;

        const {isConsultant, isNoProjects} = storage.is;

        const {usernameStatus} = this.state;

        let idx = 0;
        let idx_1 = 0.1;
        return (<FormControls>
            {!isNoProjects && <Row
                active
                rendered
                idx={'Orgs'}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput
                    name="client"
                    placeholder="Company..."
                    showAll
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}/>
                }
                <SelectProjectInput
                    name="project"
                    placeholder="Project..."
                    showAll
                    className="col-lg-12 form-control" onChange={this.form.onChange}
                />
                <SelectSiteInput
                    name="site"
                    placeholder="Site..."
                    showAll
                    className="col-lg-12 form-control" onChange={this.form.onChange}
                />
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={'Blacklisting'}
                title={`${idx += 1}. Blacklisting`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNoProjects && onFormBack}
            >
                <FormControls>
                    {isConsultant && <Row
                        rendered
                        idx={'BlacklistedCompanies'}
                        title={(idx + "." + idx_1) + ". Blacklisted Companies"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewClientListUpdateBlacklistTable
                            name="client_blacklist"
                            onChange={this.form.onChange}
                        />
                    </Row>}
                    <Row
                        rendered
                        idx={'BlacklistedProjects'}
                        title={(idx + "." + (idx_1++)) + ". Blacklisted Projects"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <NewProjectListUpdateBlacklistTable
                            name="project_blacklist"
                            onChange={this.form.onChange}
                        />
                    </Row>
                    <Row
                        rendered
                        idx={'BlacklistedSites'}
                        title={(idx + "." + (idx_1++)) + ". Blacklisted Sites"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewSiteListUpdateBlacklistTable
                            name="site_blacklist"
                            onChange={this.form.onChange}
                        />
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                active={isNoProjects}
                idx={'LoginDetails'}
                title={`${idx += 1}. Login Details`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNoProjects && onFormBack}
            >
                <ClearableInput ref="username" name="username" type="email" placeholder="Username / Email Address"
                                required className="col-lg-12 z-index-2 form-control" onChange={this.form.onChange}/>
                <UsernameStatus ref="usernameStatus" usernameStatus={usernameStatus}
                                access_type="User"
                                onChange={this.onChangeUsernameStatus}/>
                <UserDetails ref="userDetails" usernameStatus={usernameStatus} onChange={this.form.onChange}/>
                <ClearableInput name="auth_type" type="radio" placeholder="Authentication Type" required vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.auth_type}/>
            </Row>
            <Row
                rendered
                idx={'NotificationsSettings'}
                title={`${idx += 1}. Notifications Settings`}
                className="NotificationsSettings-row"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ClearableInput name="receive_asset_management_notifs" type="checkbox"
                                className="col-lg-12 form-control margin-b-0" vertical onChange={this.form.onChange}
                                values={this.state.lists.receive_asset_management_notifs} returnValue/>
                <ClearableInput name="receive_chemicals_management_notifs" type="checkbox"
                                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                onChange={this.form.onChange}
                                values={this.state.lists.receive_chemicals_management_notifs} returnValue/>
                <ClearableInput name="receive_contractor_management_notifs" type="checkbox"
                                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                onChange={this.form.onChange}
                                values={this.state.lists.receive_contractor_management_notifs} returnValue/>
                <ClearableInput name="receive_employees_expired_docs_medicals" type="checkbox"
                                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                onChange={this.form.onChange}
                                values={this.state.lists.receive_employees_expired_docs_medicals} returnValue/>
                <ClearableInput name="receive_employees_profile_notifs" type="checkbox"
                                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                onChange={this.form.onChange}
                                values={this.state.lists.receive_employees_profile_notifs} returnValue/>
                <ClearableInput name="receive_incident_management_notifs" type="checkbox"
                                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                onChange={this.form.onChange}
                                values={this.state.lists.receive_incident_management_notifs} returnValue/>
                <ClearableInput name="receive_non_conformance_management_notifs" type="checkbox"
                                className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                onChange={this.form.onChange}
                                values={this.state.lists.receive_non_conformance_management_notifs} returnValue/>
                <ClearableInput name="receive_training_management_notifs" type="checkbox"
                                className="col-lg-12 form-control margin-t-5 margin-b-10" vertical
                                onChange={this.form.onChange}
                                values={this.state.lists.receive_training_management_notifs} returnValue/>

                <hr className="margin-v-10"/>

                <ClearableInput name="receive_expired_docs_notifs" type="checkbox" required
                                className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
                                values={this.state.lists.receive_expired_docs_notifs} returnValue/>
            </Row>
            <Row
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
                        <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
                                text="Select All"
                                actionRef="NewUserModulePermissionsBySHEQ" onClick={this.onSelectAllModulePermissions}/>
                        <Button className="btn btn-primary pull-right padding-5" text="Clear All"
                                actionRef="NewUserModulePermissionsBySHEQ" onClick={this.onClearAllModulePermissions}/>
                        <hr className="pull-left"/>
                        <NewUserModulePermissionsBySHEQ ref="NewUserModulePermissionsBySHEQ"
                                                        name="permissions_modules_sheq" disableOneChange
                                                        onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + 0.2}
                        title={idx + ".2. HR Management Module Permissions"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
                                text="Select All"
                                actionRef="NewUserModulePermissionsByHR" onClick={this.onSelectAllModulePermissions}/>
                        <Button className="btn btn-primary pull-right padding-5" text="Clear All"
                                actionRef="NewUserModulePermissionsByHR" onClick={this.onClearAllModulePermissions}/>
                        <hr className="pull-left"/>
                        <NewUserModulePermissionsByHR ref="NewUserModulePermissionsByHR" name="permissions_modules_hr"
                                                      disableOneChange
                                                      onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + 0.3}
                        title={idx + ".3. ClaimsClient Management Module Permissions"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
                                text="Select All"
                                actionRef="NewUserModulePermissionsByClaim"
                                onClick={this.onSelectAllModulePermissions}/>
                        <Button className="btn btn-primary pull-right padding-5" text="Clear All"
                                actionRef="NewUserModulePermissionsByClaim" onClick={this.onClearAllModulePermissions}/>
                        <hr className="pull-left"/>
                        <NewUserModulePermissionsByClaim ref="NewUserModulePermissionsByClaim"
                                                         name="permissions_modules_claims" disableOneChange
                                                         onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + 0.4}
                        title={idx + ".4. Extra Module Permissions"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
                                text="Select All"
                                actionRef="NewUserModulePermissionsByExtra"
                                onClick={this.onSelectAllModulePermissions}/>
                        <Button className="btn btn-primary pull-right padding-5" text="Clear All"
                                actionRef="NewUserModulePermissionsByExtra" onClick={this.onClearAllModulePermissions}/>
                        <hr className="pull-left"/>
                        <NewUserModulePermissionsByExtra ref="NewUserModulePermissionsByExtra"
                                                         name="permissions_modules_extra" disableOneChange
                                                         onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + 0.5}
                        title={idx + ".5. Other Permissions"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <Button className="btn btn-primary pull-right margin-l-10 margin-r-10 padding-5"
                                text="Select All"
                                onClick={this.onSelectAllOtherPermissions}/>
                        <Button className="btn btn-primary pull-right padding-5" text="Clear All"
                                onClick={this.onClearAllOtherPermissions}/>
                        <hr className="pull-left"/>
                        <NewUserOtherPermissions ref="otherPermissionsRef" name="permissions_other_list"
                                                 disableOneChange
                                                 onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default Controls;
