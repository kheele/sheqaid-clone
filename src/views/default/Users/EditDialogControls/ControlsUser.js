// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable, toJS} from 'mobx';
import {isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js';

import Form from '../../../../utils/Form';
import {onChangeUsername} from '../../../../utils/UsersFuns';

import {debounce, execWhen, ShouldUpdate} from '../../../../utils/Utils';
import {
    Button,
    ClearableInput,
    ProfilePic,
    SelectClientInput,
    SelectCountryCodeInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../components/inputs';
import {FormControls, Row} from '../../../../components/FormComponents';

import {
    NewUserModulePermissions,
    NewUserModulePermissionsByClaim, NewUserModulePermissionsByExtra,
    NewUserModulePermissionsByHR,
    NewUserModulePermissionsBySHEQ,
    NewUserOtherPermissions
} from '../../../../components/common-modules/ANewUserPermissions';

import SetupPhoneNumDialog from '../../../../components/dialogs/SetupPhoneNumDialog';

import EditPasswordDialog from "../EditPasswordDialog.js";
import NewClientListUpdateBlacklistTable
    from "../../../../components/FormTableComponents/NewClientListUpdateBlacklistTable";
import NewProjectListUpdateBlacklistTable
    from "../../../../components/FormTableComponents/NewProjectListUpdateBlacklistTable";
import NewSiteListUpdateBlacklistTable
    from "../../../../components/FormTableComponents/NewSiteListUpdateBlacklistTable";
import updateUser from "./updateUser";

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
            //
        },
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

        this.path = 'users/update/';

        this.onNext = this.onNext.bind(this);

        this.onSelectAllModulePermissions = this.onSelectAllModulePermissions.bind(this);
        this.onClearAllModulePermissions = this.onClearAllModulePermissions.bind(this);
        this.onSelectAllOtherPermissions = this.onSelectAllOtherPermissions.bind(this);
        this.onClearAllOtherPermissions = this.onClearAllOtherPermissions.bind(this);

        this.onUploaded = this.onUploaded.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.onChangeUsernameStatus = this.onChangeUsernameStatus.bind(this);

        this.updateUser = updateUser.bind(this);

        this.form = new Form();
        this.form.addChangeOne("username", debounce(onChangeUsername.call(this, "users/accounts/")).bind(this));
    }
    // </editor-fold>

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        const {forShouldSetupPermissions} = this.props;
        if (forShouldSetupPermissions) {
            this.onSelectAllModulePermissions();
            Promise.all(['NewUserModulePermissionsBySHEQ', 'NewUserModulePermissionsByHR', 'NewUserModulePermissionsByClaim', 'NewUserModulePermissionsByExtra'].
            map(ref => execWhen(() => this.refs[ref]).then(ref => {
                ref.selectAll();
            })));
            this.onSelectAllOtherPermissions();
        }
    }

    //</editor-fold>

    //<editor-fold desc="onChangeUsernameStatus">
    onChangeUsernameStatus(status) {
        execWhen(() => this.refs.signup && this.refs.usernameStatus && this.refs.userDetails).then(() => {
            const {signup, usernameStatus, userDetails} = this.refs;
            if (status.status === 'CONFIRMED' || usernameStatus.isAvailable) {
                signup.show();
                // alert(usernameStatus.isAvailable)
                if (usernameStatus.isAvailable) {
                    userDetails.showPasswords();
                }
            } else {
                signup.hide();
            }
        });
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="funs">
    onSelectAllModulePermissions(evt, btn) {
        const {actionRef} = btn.props;
        execWhen(() => this.refs[actionRef]).then(ref => {
            ref.selectAll();
        });
    }

    onClearAllModulePermissions(evt, btn) {
        const {actionRef} = btn.props;
        execWhen(() => this.refs[actionRef]).then(ref => {
            ref.unselectAll();
        });
    }

    onSelectAllOtherPermissions() {
        execWhen(() => this.refs.otherPermissionsRef).then(ref => {
            ref.selectAll();
        });
    }

    onClearAllOtherPermissions() {
        execWhen(() => this.refs.otherPermissionsRef).then(ref => {
            ref.unselectAll();
        });
    }

    onUploaded(path) {
        this.item.data.profile_pic = path;
        if (this.isLoggedUser) {
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
    async onNext(e, btn) {
        const {form, item: {data: old_data}} = this;
        const {idx} = btn.props;
        const {shouldSetupPermissions, isNoProjects} = storage.is;

        if (!shouldSetupPermissions) {
            let idxMatch = !isNoProjects ? 2 : 1;
            if (idx === idxMatch) {
                const {employee} = this.state;
                if (!employee && !form.isValid('fname')) {
                    infoDialog.open('First Name is required');
                    return;
                }
                if (!employee && !form.isValid('lname')) {
                    infoDialog.open('Last Name is required');
                    return;
                }

                if (this.isLoggedUser) {
                    const data_test = {};
                    ShouldUpdate.check(data_test, old_data, this.phoneNumberNew, 'phone');

                    if (!Object.values(data_test).isEmpty()) {
                        if (form.isValid('country') && !form.isValid('phone')) {
                            infoDialog.open('Phone Number required');
                            return;
                        }
                        if (!form.isValid('country') && form.isValid('phone')) {
                            infoDialog.open('Phone Code required');
                            return;
                        }
                        if (form.isValid('country') && form.isValid('phone')) {
                            const isValid = isValidPhoneNumber(String(form.get('phone')), form.get('country').isoCode);
                            if (!isValid) {
                                infoDialog.open('Phone Number is not valid');
                                return;
                            } else {
                                const res = await this.refs.setupPhoneNumDialog.extraProp('isoCode', form.get('country').isoCode).extraProp('phoneNumber', form.get('phone')).open(storage.loggedUser).then(res => {
                                    console.log('setupPhoneNumDialog res', res);
                                    return res;
                                });
                                if (!res) {
                                    return;
                                }
                            }
                        }
                    }
                }
            }

            idxMatch++;
            if (idx === idxMatch) {
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
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;
        const {shouldSetupPermissions} = storage.is;

        let phoneUpdated, passwordVerified, password_conf;
        if (!shouldSetupPermissions) {
            //2
            if (!form.isValid('fname')) {
                infoDialog.open('First Name is required');
                return;
            }
            if (!form.isValid('lname')) {
                infoDialog.open('Last Name is required');
                return;
            }
            if (this.isLoggedUser) {
                const data_test = {};
                ShouldUpdate.check(data_test, old_data, this.phoneNumberNew, 'phone');

                if (!Object.values(data_test).isEmpty()) {
                    if (form.isValid('country') && !form.isValid('phone')) {
                        infoDialog.open('Phone Number required');
                        return;
                    }
                    if (!form.isValid('country') && form.isValid('phone')) {
                        infoDialog.open('Phone Code required');
                        return;
                    }
                    if (form.isValid('country') && form.isValid('phone')) {
                        const isValid = isValidPhoneNumber(String(form.get('phone')), form.get('country').isoCode);
                        if (!isValid) {
                            infoDialog.open('Phone Number is not valid');
                            return;
                        } else {
                            const text = await inputDialog.password().open("Enter Password");
                            if (!text) {
                                infoDialog.open('Password is required');
                                return;
                            }

                            password_conf = text;
                            passwordVerified = true;

                            const res = await this.refs.setupPhoneNumDialog.
                            extraProp('isoCode', form.get('country').isoCode).
                            extraProp('phoneNumber', form.get('phone')).
                            open(storage.loggedUser).then(res => {
                                console.log('setupPhoneNumDialog res', res);
                                return res;
                            });
                            if (!res) {
                                return;
                            }
                            phoneUpdated = res;
                        }
                    }
                }
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
        }

        const {
            fname,
            lname,
            phone,
            username,
            auth_type,
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
        const data = {};

        if (!shouldSetupPermissions) {
            ShouldUpdate.check(data, old_data, fname, 'fname');
            ShouldUpdate.check(data, old_data, lname, 'lname');
            if (this.isLoggedUser) {
                ShouldUpdate.check(data, old_data, this.phoneNumberNew, 'phone');
            }
            ShouldUpdate.check(data, old_data, username, 'username');
            ShouldUpdate.check(data, old_data, auth_type, 'auth_type');
        }

        //
        ShouldUpdate.checkBoxList(data, old_data, receive_modules_notifs, 'receive_modules_notifs');
        //
        ShouldUpdate.checkBox(data, old_data, receive_expired_docs_notifs, 'receive_expired_docs_notifs');
        //

        if (!shouldSetupPermissions) {
            ShouldUpdate.checkClient(data, old_data, client);
            ShouldUpdate.checkProject(data, old_data, project);
            ShouldUpdate.checkSite(data, old_data, site);

            ShouldUpdate.checkClientBlacklist(data, old_data, client_blacklist, 'client_blacklist');
            ShouldUpdate.checkProjectBlacklist(data, old_data, project_blacklist, 'project_blacklist');
            ShouldUpdate.checkSiteBlacklist(data, old_data, site_blacklist, 'site_blacklist');
        }

        const permissions_modules = [
            ...(permissions_modules_sheq || []),
            ...(permissions_modules_hr || []),
            ...(permissions_modules_claims || []),
            ...(permissions_modules_extra || [])
        ];
        console.log("checkListPermissionsModules", permissions_modules)
        console.log("checkListPermissionsOther", permissions_other)
        ShouldUpdate.checkListPermissionsModules(data, old_data, permissions_modules);
        ShouldUpdate.checkListPermissionsOther(data, old_data, permissions_other);

        if(password_conf) {
            data.password_conf = password_conf;
        }
        this.updateUser({
            btn, data, phoneUpdated, passwordVerified, shouldSetupPermissions, onSaved,
            client, project, site
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="phoneNumberNew">
    get phoneNumberNew() {
        const {form} = this;
        let {country, phone} = form.data;
        if (phone) {
            phone = String(phone).replaceAll(' ', '').replaceAll('+', '').replaceAll('(', '').replaceAll(')', '');
        } else {
            phone = "";
        }
        const code = country ? country.dialCode : "";
        if (phone.trim().replaceAll(" ", "").startsWith("0")) {
            return code + (phone.length > 0 ? phone.substring(1) : "");
        } else {
            return code + phone;
        }
    }

    // </editor-fold>

    //<editor-fold desc="phoneCode">
    get phoneCode() {
        let {phone} = this.item.data;
        if (phone && isValidPhoneNumber(phone)) {
            const phoneNumber = parsePhoneNumber(phone);
            if (phoneNumber) {
                return phoneNumber.country;
            }
        }
        return null;
    }
    //</editor-fold>

    //<editor-fold desc="phoneNumber">
    get phoneNumber() {
        let {phone} = this.item.data;
        if (phone && isValidPhoneNumber(phone)) {
            const phoneNumber = parsePhoneNumber(phone);
            if (phoneNumber) {
                return phoneNumber.nationalNumber;
            }
        }
        return null;
    }
    //</editor-fold>

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
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    profile_pic,
                    fname,
                    lname,
                    phone,
                    username,
                    auth_type = "MultiFactor",
                    receive_modules_notifs,
                    receive_expired_docs_notifs,
                    permissions_modules,
                    permissions_other,
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

        const {data = {}} = contractor;
        const {name: contractorName} = data;

        console.log(this.item)

        const {
            isConsultant,
            shouldSetupPermissions,
            isNoProjects,
            isClientBlacklisted,
            isProjectBlacklisted,
            isSiteBlacklisted
        } = storage.is;

        if (shouldSetupPermissions) {
            receive_expired_docs_notifs = true;
        }
        setTimeout(() => {
            this.state.lists.receive_expired_docs_notifs[0].checked = !!receive_expired_docs_notifs;
        }, 0);

        const path = this.path + "upload/profile-pic/user";

        const showBlacklisting = !isClientBlacklisted(client) && !isProjectBlacklisted(project) && !isSiteBlacklisted(site);

        let idx = 0;
        let idx_1 = 0.1;
        return (<FormControls>
            {!shouldSetupPermissions && !isNoProjects && <Row
                active
                rendered
                idx={idx += 1}
                title={idx + ". Company / Project / Site"}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." showAll
                                                    defaultValue={RenderUtils.selectedClient.call(this)} required
                                                    className="col-lg-12 form-control"
                                                    onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." showAll
                                    defaultValue={RenderUtils.selectedProject.call(this)} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." showAll
                                 defaultValue={RenderUtils.selectedSite.call(this)} required
                                 className="col-lg-12 form-control" onChange={this.form.onChange}/>

                {isConsultant && showBlacklisting && <hr/>}

                {showBlacklisting && <FormControls>
                    {isConsultant && !isClientBlacklisted(client) && <Row
                        rendered
                        idx={idx + idx_1}
                        title={(idx + "." + idx_1) + ". Blacklisted Companies"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewClientListUpdateBlacklistTable name="client_blacklist"
                                                           defaultValue={[...client_blacklist, null]}
                                                           onChange={this.form.onChange}/>
                    </Row>}
                    {!isProjectBlacklisted(project) && <Row
                        rendered
                        idx={idx + (idx_1++)}
                        title={(idx + "." + idx_1) + ". Blacklisted Projects"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <NewProjectListUpdateBlacklistTable name="project_blacklist"
                                                            defaultValue={[...project_blacklist, null]}
                                                            onChange={this.form.onChange}/>
                    </Row>}
                    {!isSiteBlacklisted(project) && <Row
                        rendered
                        idx={idx + (idx_1++)}
                        title={(idx + "." + idx_1) + ". Blacklisted Sites"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewSiteListUpdateBlacklistTable name="site_blacklist" defaultValue={[...site_blacklist, null]}
                                                         onChange={this.form.onChange}/>
                    </Row>}
                </FormControls>}
            </Row>}
            {!shouldSetupPermissions && <Row
                rendered
                active={isNoProjects}
                idx={idx += 1}
                title={idx + ". User Details"}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNoProjects && onFormBack}
            >
                <ProfilePic path={path} id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>
                <ClearableInput name="fname" type="text" placeholder="First Name" defaultValue={fname} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="lname" type="text" placeholder="Last Name" defaultValue={lname} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <div
                    className="row row-input flex w-full-calc-subtract-10 pull-left margin-l-0 margin-t-10 margin-r-10">
                    <SelectCountryCodeInput name="country" type="select" placeholder="Code..."
                                            defaultValue={this.phoneCode} isEditable={this.isLoggedUser}
                                            className="fixed-flex form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="phone" type="number" placeholder="Phone Number"
                                    defaultValue={this.phoneNumber} isEditable={this.isLoggedUser}
                                    footerDesc="Don't enter a leading zero" className="-margin-l-10 form-control"
                                    onChange={this.form.onChange}/>
                </div>
            </Row>}
            {!shouldSetupPermissions && <Row
                rendered
                idx={idx += 1}
                title={idx + ". Login Details"}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ClearableInput name="username" type="email" placeholder="Username / Email Address"
                                defaultValue={username} isEditable={this.isLoggedUser} required
                                className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="auth_type" type="radio" placeholder="Authentication Type"
                                defaultValue={auth_type} required vertical className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.auth_type}/>
                {this.isLoggedUser && <hr/>}
                {this.isLoggedUser &&
                    <div className="row sec-group pos-relative padding-0 margin-0 min-h-50 margin-t-10">
                        <div className="fixed-center margin-t-5">
                            <Button className="btn btn-primary w-140" text="Change Password"
                                    onClick={this.onChangePassword}/>
                        </div>
                    </div>}
            </Row>}
            <Row
                rendered
                idx={idx += 1}
                title={idx + ". Notifications Settings"}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!shouldSetupPermissions && onFormBack}
            >
                <ClearableInput name="receive_modules_notifs" type="checkbox"
                                defaultValue={receive_modules_notifs} required
                                className="col-lg-12 form-control margin-b-10" vertical onChange={this.form.onChange}
                                values={this.state.lists.receive_modules_notifs}/>

                <hr className="margin-v-10"/>

                <ClearableInput name="receive_expired_docs_notifs" type="checkbox"
                                defaultValue={receive_expired_docs_notifs} required
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
                                                        selectedList={permissions_modules}
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
                                                      selectedList={permissions_modules} onChange={this.form.onChange}/>
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
                                                         selectedList={permissions_modules}
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
                                                         selectedList={permissions_modules}
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
                                                 selectedList={permissions_other} onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
            {this.isLoggedUser && <EditPasswordDialog ref="editPasswordDialog" item={item}/>}
            {this.isLoggedUser && <SetupPhoneNumDialog ref="setupPhoneNumDialog" isReauth/>}
        </FormControls>);
    }

    // </editor-fold>
}

export default Controls;