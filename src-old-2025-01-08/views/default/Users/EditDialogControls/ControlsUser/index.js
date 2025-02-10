// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js';

import Form from 'utils/Form';
import {onChangeUsername} from 'utils/UsersFuns';

import {debounce, execWhen} from 'utils/Utils';

import {
    NewUserModulePermissionsByClaim,
    NewUserModulePermissionsByExtra,
    NewUserModulePermissionsByHR,
    NewUserModulePermissionsBySHEQ
} from 'components/common-modules/ANewUserPermissions';

import {getPhoneNumberNew} from "utils/UtilsFuns";
import {CircularProgress} from "@mui/material";
import {updateUser} from "mutations/update";
import renderImpl from "./render";
import onSubmitImpl from "./onSubmit";
import onFormSaveImpl from "./onFormSave";
import onUpdateNotificationPermissionImpl from "./onUpdateNotificationPermission";
import onChangePermissionsImpl from "./onChangePermissions";
import verifyPhoneChangeImpl from "./verifyPhoneChange";
import verifyEmailChangeImpl from "./verifyEmailChange";

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
            //
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
        savingPermissions: [],
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.path = 'users/update/';

        this.onUpdateNotificationPermission = onUpdateNotificationPermissionImpl.bind(this);

        this.onFormSave = onFormSaveImpl.bind(this);
        this.onSubmit = onSubmitImpl.bind(this);
        this.verifyPhoneChange = verifyPhoneChangeImpl.bind(this);
        this.verifyEmailChange = verifyEmailChangeImpl.bind(this);

        this.onSelectAllModulePermissions = this.onSelectAllModulePermissions.bind(this);
        this.onClearAllModulePermissions = this.onClearAllModulePermissions.bind(this);
        this.onSelectAllOtherPermissions = this.onSelectAllOtherPermissions.bind(this);
        this.onClearAllOtherPermissions = this.onClearAllOtherPermissions.bind(this);

        this.onUploaded = this.onUploaded.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.onChangeUsernameStatus = this.onChangeUsernameStatus.bind(this);

        this.updateUser = updateUser.bind(this);

        this.form = new Form();
        this.form.addChangeOne("username", debounce(onChangeUsername.call(this, "User")).bind(this));
        this.form.addChangeMany([
            "permissions_modules_sheq",
            "permissions_modules_hr",
            "permissions_modules_claims",
            "permissions_modules_extra",
            "permissions_other_list",
        ], onChangePermissionsImpl.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="usernameNew">
    get usernameNew() {
        const {form} = this;
        let {username} = form.data;
        return username;
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="phoneNumberNew">
    get phoneNumberNew() {
        const {form} = this;
        let {country, phone} = form.data;
        return getPhoneNumberNew({country, phone});
    }

    //</editor-fold>

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
            Promise.all(['NewUserModulePermissionsBySHEQ', 'NewUserModulePermissionsByHR', 'NewUserModulePermissionsByClaim', 'NewUserModulePermissionsByExtra'].map(ref => execWhen(() => this.refs[ref]).then(ref => {
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
                //
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
            this.item.data.password = newPass;//TODO: remove password
        });
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        return renderImpl.call(this);
    }

    // </editor-fold>
}

export default Controls;
