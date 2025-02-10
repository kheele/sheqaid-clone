// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable} from 'mobx';
import {isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js';

import Form from 'utils/Form';
import {onChangeUsername} from 'utils/UsersFuns';

import {debounce, execWhen, ShouldUpdate} from 'utils/Utils';
import {Button, ClearableInput, ProfileField, ProfilePic, SelectCountryCodeInput} from 'components/inputs';
import {Row} from 'components/FormComponents';

import SetupPhoneNumDialog from 'components/dialogs/SetupPhoneNumDialog';

import EditPasswordDialog from "../EditPasswordDialog.js";
import updateUser from "./updateUser";
import {getPhoneNumberNew} from "utils/UtilsFuns";
import {CircularProgress} from "@mui/material";
import {upsertNotificationSetting} from "mutations/upsert";

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
            receive_inspection_management_notifs: [{
                text: "Receive Inspection Management Notifications",
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
        usernameStatus: {
            valid: false,
            required: true,
            exist: false,
            duplicate: false,
            uid: null,
            customToken: null,
            loading: false,
            username: null
        },
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = "plugin_sheq_assist/contractors/users/";

        this.onUpdateNotificationPermission = this.onUpdateNotificationPermission.bind(this);

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
        this.form.addChangeOne("username", debounce(onChangeUsername.call(this, "ContractorUser")).bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="phoneNumberNew">
    get phoneNumberNew() {
        const {form} = this;
        let {country, phone} = form.data;
        return getPhoneNumberNew({country, phone});
    }

    //</editor-fold>

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

    @computed get item() {
        return this.props.state.item;
    }

    get isLoggedUser() {
        const {user} = storage.loggedUser;
        return this.item.id === user.id;
    }

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        const {forShouldSetupPermissions} = this.props;
        if (forShouldSetupPermissions) {
            this.onSelectAllModulePermissions();
            this.onSelectAllOtherPermissions();
        }
    }

    //<editor-fold desc="onChangeUsernameStatus">
    onChangeUsernameStatus(status) {
        execWhen(() => this.refs.signup && this.refs.usernameStatus && this.refs.userDetails).then(() => {
            const {signup, usernameStatus, userDetails} = this.refs;
            if (status.status === 'CONFIRMED' || usernameStatus.isAvailable) {
                signup.show();
                //
                if (usernameStatus.isAvailable) {
                    userDetails.showPasswords();
                }
            } else {
                signup.hide();
            }
        });
    }

    //<editor-fold desc="onUpdateNotificationPermission">
    onUpdateNotificationPermission(el, val, action) {//ADDED / REMOVED
        let {item: {id, data: old_data, data: {notifications_settings}}} = this;

        const input = el.getDOMNode().querySelector('input');
        console.log('onUpdateNotificationPermission', input.name, val, action, notifications_settings);//{checked, name}
        // return;

        el.setReadonly(true);

        const {name: key} = input;
        upsertNotificationSetting({contractor_user_id: id, ...input, notifications_settings}).then(res => {
            console.log("res", res)
            if (res) {
                if (notifications_settings) {
                    notifications_settings[key] = action === 'ADDED';
                } else {
                    extendObservable(old_data, {notifications_settings: res.data});
                }
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                return true;
            } else {
                infoDialog.open("Record couldn't be updated. Please try again later.");
            }
        }).catch(err => {
            console.error(err);
            infoDialog.open("Record couldn't be updated. Please try again later.");
        }).finally(() => {
            el.setReadonly(false);
            console.log('onUpdateNotificationPermission', el, val, action, notifications_settings);//{checked, name}
        });
    }

    // <editor-fold defaultstate="collapsed" desc="funs">
    onSelectAllModulePermissions() {
        execWhen(() => this.refs.modulePermissionsRef).then(ref => {
            ref.selectAll();
        });
    }

    // </editor-fold>

    onClearAllModulePermissions() {
        execWhen(() => this.refs.modulePermissionsRef).then(ref => {
            ref.unselectAll();
        });
    }

    // </editor-fold>

    onSelectAllOtherPermissions() {
        execWhen(() => this.refs.otherPermissionsRef).then(ref => {
            ref.selectAll();
        });
    }

    // </editor-fold>

    onClearAllOtherPermissions() {
        execWhen(() => this.refs.otherPermissionsRef).then(ref => {
            ref.unselectAll();
        });
    }

    // </editor-fold>

    onUploaded(path) {
        extendObservable(this.item.data, {profile_pic: path});
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

    // <editor-fold defaultstate="collapsed" desc="onNext">
    async onNext(e, btn) {
        const {form, item: {data: old_data}} = this;
        const {idx} = btn.props;

        if (idx === 1) {
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
                        const isValid = isValidPhoneNumber(String(form.get('phone')), form.get('country').data.iso2);
                        if (!isValid) {
                            infoDialog.open('Phone Number is not valid');
                            return;
                        } else {
                            const res = await this.refs.setupPhoneNumDialog.extraProp('isoCode', form.get('country').data.iso2).extraProp('phoneNumber', form.get('phone')).open(storage.loggedUser).then(res => {
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
        if (idx === 2) {
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

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
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

        let phoneUpdated, passwordVerified, password_conf;
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
                    const isValid = isValidPhoneNumber(String(form.get('phone')), form.get('country').data.iso2);
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

                        const res = await this.refs.setupPhoneNumDialog.extraProp('isoCode', form.get('country').data.iso2).extraProp('phoneNumber', form.get('phone')).open(storage.loggedUser).then(res => {
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
            permissions_modules_sheq,
            permissions_modules_hr,
            permissions_modules_claims,
            permissions_modules_extra,
            permissions_other
        } = form.data;
        const data = {};

        ShouldUpdate.check(data, old_data, fname, 'fname');
        ShouldUpdate.check(data, old_data, lname, 'lname');
        if (this.isLoggedUser) {
            ShouldUpdate.check(data, old_data, this.phoneNumberNew, 'phone');
        }
        ShouldUpdate.check(data, old_data, username, 'username');
        ShouldUpdate.check(data, old_data, auth_type, 'auth_type');

        //
        ShouldUpdate.checkBoxList(data, old_data, receive_modules_notifs, 'receive_modules_notifs');
        //
        ShouldUpdate.checkBox(data, old_data, receive_expired_docs_notifs, 'receive_expired_docs_notifs');
        //

        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);

        const permissions_modules = [
            ...(permissions_modules_sheq || []),
            ...(permissions_modules_hr || []),
            ...(permissions_modules_claims || []),
            ...(permissions_modules_extra || [])
        ];
        console.log("checkListPermissionsModules", permissions_modules)
        ShouldUpdate.checkListPermissionsModules(data, old_data, permissions_modules);
        ShouldUpdate.checkListPermissionsOther(data, old_data, permissions_other);

        if (password_conf) {
            data.password_conf = password_conf;
        }
        this.updateUser({
            btn, data, phoneUpdated, passwordVerified, onSaved,
            client, project, site
        });
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

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
                    //
                    notifications_settings = {},
                    //
                    permissions_module_list,
                    permissions_other_list,
                    //
                    client,
                    project,
                    site,
                    contractor = {}
                }
            }
        } = this;

        const {name: contractorName} = contractor || {};

        console.log(this.item)

        let {
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
        setTimeout(() => {
            this.state.lists.receive_asset_management_notifs[0].checked = !!receive_asset_management_notifs;
            this.state.lists.receive_chemicals_management_notifs[0].checked = !!receive_chemicals_management_notifs;
            this.state.lists.receive_contractor_management_notifs[0].checked = !!receive_contractor_management_notifs;
            this.state.lists.receive_employees_expired_docs_medicals[0].checked = !!receive_employees_expired_docs_medicals;
            this.state.lists.receive_employees_profile_notifs[0].checked = !!receive_employees_profile_notifs;
            this.state.lists.receive_incident_management_notifs[0].checked = !!receive_incident_management_notifs;
            this.state.lists.receive_inspection_management_notifs[0].checked = !!receive_inspection_management_notifs;
            this.state.lists.receive_non_conformance_management_notifs[0].checked = !!receive_non_conformance_management_notifs;
            this.state.lists.receive_training_management_notifs[0].checked = !!receive_training_management_notifs;
            this.state.lists.receive_expired_docs_notifs[0].checked = !!receive_expired_docs_notifs;
        }, 0);


        const path = "upload/profile-pic";

        let idx = 0;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row
                    active
                    rendered
                    idx={idx += 0.1}
                    title="My Contractor Details"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                >
                    <ProfileField title="Contractor Name" value={contractorName} className="col-lg-12"/>
                </Row>
                <Row
                    rendered
                    idx={idx += 0.1}
                    title="Company Details"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <ProfileField title="Company" value={client} renderer={v => v.name}
                                  className="col-lg-12"/>
                    <ProfileField title="Site" value={site} renderer={v => v.name}
                                  className="col-lg-12"/>
                </Row>
                <Row
                    rendered
                    idx={idx += 0.8}
                    title={idx + ". User Details"}
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
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
                </Row>
                <Row
                    rendered
                    idx={idx += 1}
                    title={idx + ". Login Details"}
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <ClearableInput name="username" type="email" placeholder="Username / Email Address"
                                    defaultValue={username} required className="col-lg-12 form-control"
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
                </Row>
                <Row
                    rendered
                    idx={idx += 1}
                    title={idx + ". Notifications Settings"}
                    className="NotificationsSettings-row"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                >
                    <ClearableInput name="receive_asset_management_notifs" type="checkbox"
                                    defaultValue={receive_asset_management_notifs} required
                                    className="col-lg-12 form-control margin-b-0" vertical onChange={this.form.onChange}
                                    onUpdate={this.onUpdateNotificationPermission}
                                    values={this.state.lists.receive_asset_management_notifs} returnValue/>
                    <ClearableInput name="receive_chemicals_management_notifs" type="checkbox"
                                    defaultValue={receive_chemicals_management_notifs} required
                                    className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                    onChange={this.form.onChange}
                                    onUpdate={this.onUpdateNotificationPermission}
                                    values={this.state.lists.receive_chemicals_management_notifs} returnValue/>
                    <ClearableInput name="receive_contractor_management_notifs" type="checkbox"
                                    defaultValue={receive_contractor_management_notifs} required
                                    className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                    onChange={this.form.onChange}
                                    onUpdate={this.onUpdateNotificationPermission}
                                    values={this.state.lists.receive_contractor_management_notifs} returnValue/>
                    <ClearableInput name="receive_employees_expired_docs_medicals" type="checkbox"
                                    defaultValue={receive_employees_expired_docs_medicals} required
                                    className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                    onChange={this.form.onChange}
                                    onUpdate={this.onUpdateNotificationPermission}
                                    values={this.state.lists.receive_employees_expired_docs_medicals} returnValue/>
                    <ClearableInput name="receive_employees_profile_notifs" type="checkbox"
                                    defaultValue={receive_employees_profile_notifs} required
                                    className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                    onChange={this.form.onChange}
                                    onUpdate={this.onUpdateNotificationPermission}
                                    values={this.state.lists.receive_employees_profile_notifs} returnValue/>
                    <ClearableInput name="receive_incident_management_notifs" type="checkbox"
                                    defaultValue={receive_incident_management_notifs} required
                                    className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                    onChange={this.form.onChange}
                                    onUpdate={this.onUpdateNotificationPermission}
                                    values={this.state.lists.receive_incident_management_notifs} returnValue/>
                    <ClearableInput name="receive_inspection_management_notifs" type="checkbox"
                                    defaultValue={receive_inspection_management_notifs} required
                                    className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                    onChange={this.form.onChange}
                                    onUpdate={this.onUpdateNotificationPermission}
                                    values={this.state.lists.receive_inspection_management_notifs} returnValue/>
                    <ClearableInput name="receive_non_conformance_management_notifs" type="checkbox"
                                    defaultValue={receive_non_conformance_management_notifs} required
                                    className="col-lg-12 form-control margin-t-5 margin-b-0" vertical
                                    onChange={this.form.onChange}
                                    onUpdate={this.onUpdateNotificationPermission}
                                    values={this.state.lists.receive_non_conformance_management_notifs} returnValue/>
                    <ClearableInput name="receive_training_management_notifs" type="checkbox"
                                    defaultValue={receive_training_management_notifs} required
                                    className="col-lg-12 form-control margin-t-5 margin-b-10" vertical
                                    onChange={this.form.onChange}
                                    onUpdate={this.onUpdateNotificationPermission}
                                    values={this.state.lists.receive_training_management_notifs} returnValue/>

                    <hr className="margin-v-10"/>

                    <ClearableInput name="receive_expired_docs_notifs" type="checkbox"
                                    defaultValue={receive_expired_docs_notifs} required
                                    className="col-lg-12 form-control margin-b-10" onChange={this.form.onChange}
                                    onUpdate={this.onUpdateNotificationPermission}
                                    values={this.state.lists.receive_expired_docs_notifs} returnValue/>
                </Row>
            </div>
            {this.isLoggedUser && <EditPasswordDialog ref="editPasswordDialog" item={item}/>}
            {this.isLoggedUser && <SetupPhoneNumDialog ref="setupPhoneNumDialog" isReauth/>}
        </div>);
    }

    // </editor-fold>
}

export default Controls;
