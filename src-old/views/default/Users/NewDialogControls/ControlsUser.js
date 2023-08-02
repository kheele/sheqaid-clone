// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from '../../../../utils/Form';
import {onChangeUsername} from '../../../../utils/UsersFuns';

import {debounce, execWhen} from '../../../../utils/Utils';
import {
    Button,
    ClearableInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput,
    UsernameStatus
} from '../../../../components/inputs';
import {FormControls, Row} from '../../../../components/FormComponents';

import {
    NewUserModulePermissions,
    NewUserModulePermissionsByClaim, NewUserModulePermissionsByExtra,
    NewUserModulePermissionsByHR,
    NewUserModulePermissionsBySHEQ,
    NewUserOtherPermissions
} from '../../../../components/common-modules/ANewUserPermissions';

import UserDetails from "./UserDetails.js";
import NewClientListUpdateBlacklistTable
    from "../../../../components/FormTableComponents/NewClientListUpdateBlacklistTable";
import NewProjectListUpdateBlacklistTable
    from "../../../../components/FormTableComponents/NewProjectListUpdateBlacklistTable";
import NewSiteListUpdateBlacklistTable
    from "../../../../components/FormTableComponents/NewSiteListUpdateBlacklistTable";

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
            receive_modules_notifs: [
                {
                    text: "Receive Contractor Management Notifications",
                    value: true,
                    checked: false
                },
                {
                    text: "Receive Asset Management Notifications",
                    value: true,
                    checked: false
                },
                {
                    text: "Receive Incident Management Notifications",
                    value: true,
                    checked: false
                },
                {
                    text: "Receive Chemicals Management Notifications",
                    value: true,
                    checked: false
                },
                {
                    text: "Receive Non-Conformance Management Notifications",
                    value: true,
                    checked: false
                }
            ],
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

        this.form.addChangeOne("username", debounce(onChangeUsername.call(this, "users/accounts/")).bind(this));
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
                // alert(usernameStatus.isAvailable)
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
            profile_pic: ref_profile_pic,
            fname: ref_fname,
            lname: ref_lname,
            username: ref_username
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

        if (idx === 2) {
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
            password,
            auth_type = 'MultiFactor',
            receive_modules_notifs,
            receive_expired_docs_notifs,
            site,
            project,
            client,
            client_blacklist,
            project_blacklist,
            site_blacklist,
            permissions_modules_sheq,
            permissions_modules_hr,
            permissions_modules_claims,
            permissions_modules_extra,
            permissions_other
        } = form.data;
        const data = {
            fname, lname, username, auth_type
        };

        //
        if (receive_modules_notifs) {
            data.receive_modules_notifs = toJS(receive_modules_notifs);
        }
        //
        if (receive_expired_docs_notifs) {
            data.receive_expired_docs_notifs = receive_expired_docs_notifs;
        } else {
            data.receive_expired_docs_notifs = false;
        }
        //

        if (employee) {
            data.linked_employee_id = employee.id;
            data.fname = employee.fname;
            data.lname = employee.lname;
        }
        if (profile_pic) {
            data.profile_pic = profile_pic.path ? profile_pic.path : profile_pic;
        }

        if (site) {
            data.site_id = site.id;
        }
        if (project) {
            data.project_id = project.id;
        }
        if (client) {
            data.client_id = client.id;
        }
        if (client_blacklist) {
            data.client_blacklist = client_blacklist.map(v => v.id || v.client.id).slice();
        }
        if (project_blacklist) {
            data.project_blacklist = project_blacklist.map(v => v.id || v.project.id).slice();
        }
        if (site_blacklist) {
            data.site_blacklist = site_blacklist.map(v => v.id || v.site.id).slice();
        }

        if (permissions_modules_sheq || permissions_modules_hr || permissions_modules_claims || permissions_modules_extra) {
            data.permissions_modules = toJS([
                ...(permissions_modules_sheq || []),
                ...(permissions_modules_hr || []),
                ...(permissions_modules_claims || []),
                ...(permissions_modules_extra || [])
            ]);
        }
        if (permissions_other) {
            data.permissions_other = toJS(permissions_other);
        }
        console.log(data)

        progressDialog.open();
//        btn.text("Saving...").disabled();
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
//            btn.text("Save").enabled();
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
        return (<FormControls>
            {!isNoProjects && <Row
                active
                rendered
                idx={idx += 1}
                title={idx + ". Company / Project / Site"}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required showAll
                                                    className="col-lg-12 form-control"
                                                    onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required showAll
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required showAll
                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>

                {isConsultant && <hr/>}

                <FormControls>
                    {isConsultant && <Row
                        rendered
                        idx={idx + 0.1}
                        title={idx + ".1. Blacklisted Companies"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewClientListUpdateBlacklistTable name="client_blacklist" onChange={this.form.onChange}/>
                    </Row>}
                    <Row
                        rendered
                        idx={idx + 0.2}
                        title={idx + ".2. Blacklisted Projects"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <NewProjectListUpdateBlacklistTable name="project_blacklist" onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + 0.3}
                        title={idx + ".3. Blacklisted Sites"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewSiteListUpdateBlacklistTable name="site_blacklist" onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={idx += 1}
                title={idx + ". User Details"}
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
                idx={idx += 1}
                title={idx + ". Notifications Settings"}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ClearableInput name="receive_modules_notifs" type="checkbox" required
                                className="col-lg-12 form-control margin-b-10" vertical onChange={this.form.onChange}
                                values={this.state.lists.receive_modules_notifs}/>

                <hr className="margin-v-10"/>

                <ClearableInput name="receive_expired_docs_notifs" type="checkbox" required
                                className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
                                values={this.state.lists.receive_expired_docs_notifs} returnValue/>
            </Row>
            <Row
                rendered
                idx={idx += 1}
                title={idx + ". Permissions"}
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
                                                        name="permissions_modules_sheq"
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
                                                      onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + 0.3}
                        title={idx + ".3. Claim Management Module Permissions"}
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
                                                         name="permissions_modules_claims"
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
                                                         name="permissions_modules_extra"
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
                        <NewUserOtherPermissions ref="otherPermissionsRef" name="permissions_other"
                                                 onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default Controls;