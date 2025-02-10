// <editor-fold defaultstate="collapsed" desc="imports">
import {ShouldUpdate} from 'utils/Utils';

export default async function onFormSave(e, btn) {
    const {
        form,
        item: {id, data: old_data},
    } = this;
    const {shouldSetupPermissions, isNoProjects} = storage.is;

    const onSubmit = async (data, onSaved) => {
        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        const btnText = btn.text();
        btn.text("Saving...").disabled();
        progressDialog.open();
        return this.updateUser({id: this.item.id, ...data}).then(res => {
            console.log("res", res)

            if (!res) {
                infoDialog.open("The password could not be updated. Please try again.");
            } else if (res === "AUTH_WRONG_PASSWORD") {
                infoDialog.open("The password is invalid.");
            } else if (res === "EMAIL_DUP") {
                infoDialog.open("A User with this email address already exist.");
            } else if (res === "PHONE_DUP") {
                infoDialog.open("A User with this phone number address already exist.");
            } else if (res === "PASSWORD_CONF_REQUIRED") {
                infoDialog.open("Password Confirmation is required in order to change Email Address or Phone Number.");
            } else if (res === 'CANT_UPDATE_OTHER_USER_EMAIL_OR_PHONE') {
                infoDialog.open("You are not allowed to change other user Email Address or Phone Number. This is for security reasons.");
            } else {
                const {username, phone} = data;
                if (username || phone) {
                    const {loggedUser: {user}} = storage;
                    if (username) {
                        user.data.username = username;
                    }
                    if (phone) {
                        user.data.phone = phone;
                    }
                }

                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                // this.props.close();
                return true;
            }
        }).catch(err => {
            throw err;
        }).finally(() => {
            btn.text(btnText).enabled();
            setTimeout(() => progressDialog.close());
        });
    };

    const {idx} = btn.props;
    if (idx === 'Orgs') {
        // const {isConsultant} = storage.is;
        // if (isConsultant && !form.isValid('client')) {
        //     infoDialog.open('Company is required');
        //     return;
        // }

        const {
            site, project, client,
        } = form.data;

        const data = {};
        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);

        return await onSubmit(data);
    }

    if (idx === 'BlacklistedCompanies') {
        //client_blacklist
    }

    if (idx === 'BlacklistedProjects') {
        //project_blacklist
    }

    if (idx === 'BlacklistedSites') {
        //site_blacklist
    }

    if (idx === 'UserDetails') {
        const {employee} = this.state;
        if (!employee && !form.isValid('fname')) {
            infoDialog.open('First Name is required');
            return;
        }
        if (!employee && !form.isValid('lname')) {
            infoDialog.open('Last Name is required');
            return;
        }

        const data = {};
        let phoneUpdated, passwordVerified, password_conf;

        if (this.isLoggedUser) {
            const res = await this.verifyPhoneChange(form, old_data);
            switch (res) {
                case "REQ_PHONE":
                case "REQ_CODE":
                case "INVALID_PHONE":
                case "REQ_PASSWORD":
                    return;
                case "NO_PHONE_SETUP":

                    break;
                case "NO_COUNTRY_AND_PHONE":

                    break;
                case "NO_CHANGE":

                    break;
                default:
                    if (res) {
                        password_conf = res.password_conf;
                        passwordVerified = res.passwordVerified;
                        phoneUpdated = res.phoneUpdated;

                        ShouldUpdate.check(data, old_data, this.phoneNumberNew, 'phone');
                    }
                    break;
            }
        }

        const {
            fname, lname,
        } = form.data;

        ShouldUpdate.check(data, old_data, fname, 'fname');
        ShouldUpdate.check(data, old_data, lname, 'lname');

        if (password_conf !== undefined) {
            data.password_conf = password_conf;
        }
        if (passwordVerified !== undefined) {
            data.passwordVerified = passwordVerified;
        }
        if (phoneUpdated !== undefined) {
            data.phoneUpdated = phoneUpdated;
        }

        return await onSubmit(data);
    }

    if (idx === 'LoginDetails') {
        let phoneUpdated, passwordVerified, password_conf;

        const data = {};

        if (this.isLoggedUser) {
            const res = await this.verifyEmailChange(form, old_data);
            switch (res) {
                case "REQ_EMAIL":
                case "INVALID_EMAIL":
                case "REQ_PASSWORD":
                    return;
                case "NO_CHANGE":

                    break;
                default:
                    if (res) {
                        password_conf = res.password_conf;
                        passwordVerified = res.passwordVerified;

                        ShouldUpdate.check(data, old_data, this.usernameNew, 'username');
                    }
                    break;
            }
        }

        // if (!form.isValid('username')) {
        //     infoDialog.open('Email Address is required');
        //     return;
        // } else if (!form.get('username').isEmailAddress()) {
        //     infoDialog.open('Email Address is not valid');
        //     return;
        // }
        if (!form.isValid('auth_type')) {
            infoDialog.open('Authentication Type is required');
            return;
        }

        const {
            auth_type,
        } = form.data;
        ShouldUpdate.check(data, old_data, auth_type, 'auth_type');

        if (password_conf !== undefined) {
            data.password_conf = password_conf;
        }
        if (passwordVerified !== undefined) {
            data.passwordVerified = passwordVerified;
        }

        return await onSubmit(data);
    }

    // if (idx === 'NotificationsSettings') {
    //     const {notifications_settings} = old_data;
    //
    //     const {
    //         receive_asset_management_notifs,
    //         receive_chemicals_management_notifs,
    //         receive_contractor_management_notifs,
    //         receive_employees_expired_docs_medicals,
    //         receive_employees_profile_notifs,
    //         receive_incident_management_notifs,
    //         receive_inspection_management_notifs,
    //         receive_non_conformance_management_notifs,
    //         receive_training_management_notifs,
    //         receive_expired_docs_notifs,
    //     } = form.data;
    //     let data = {};
    //     if (!notifications_settings) {
    //         data.notifications_settings = {
    //             data: {
    //                 receive_asset_management_notifs,
    //                 receive_chemicals_management_notifs,
    //                 receive_contractor_management_notifs,
    //                 receive_employees_expired_docs_medicals,
    //                 receive_employees_profile_notifs,
    //                 receive_incident_management_notifs,
    //                 receive_inspection_management_notifs,
    //                 receive_non_conformance_management_notifs,
    //                 receive_training_management_notifs,
    //                 receive_expired_docs_notifs,
    //             }
    //         };
    //     } else {
    //         ShouldUpdate.checkBox(data, notifications_settings, receive_asset_management_notifs, 'receive_asset_management_notifs');
    //         ShouldUpdate.checkBox(data, notifications_settings, receive_chemicals_management_notifs, 'receive_chemicals_management_notifs');
    //         ShouldUpdate.checkBox(data, notifications_settings, receive_contractor_management_notifs, 'receive_contractor_management_notifs');
    //         ShouldUpdate.checkBox(data, notifications_settings, receive_employees_expired_docs_medicals, 'receive_employees_expired_docs_medicals');
    //         ShouldUpdate.checkBox(data, notifications_settings, receive_employees_profile_notifs, 'receive_employees_profile_notifs');
    //         ShouldUpdate.checkBox(data, notifications_settings, receive_incident_management_notifs, 'receive_incident_management_notifs');
    //         ShouldUpdate.checkBox(data, notifications_settings, receive_inspection_management_notifs, 'receive_inspection_management_notifs');
    //         ShouldUpdate.checkBox(data, notifications_settings, receive_non_conformance_management_notifs, 'receive_non_conformance_management_notifs');
    //         ShouldUpdate.checkBox(data, notifications_settings, receive_training_management_notifs, 'receive_training_management_notifs');
    //         ShouldUpdate.checkBox(data, notifications_settings, receive_expired_docs_notifs, 'receive_expired_docs_notifs');
    //
    //         if (Object.values(data).isNotEmpty()) {
    //             data = {
    //                 notifications_settings: {
    //                     ...notifications_settings,
    //                     ...data,
    //                 }
    //             };
    //         }
    //     }
    //
    //     return await onSubmit(data);
    // }

    switch (idx) {
        case 'SHEQManagementModulePermissions':
        case 'HRManagementModulePermissions':
        case 'ClaimManagementModulePermissions':
        case 'ExtraModulePermissions':
        case 'OtherPermissions':
            return true;
    }

    return true;
}