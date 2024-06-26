// <editor-fold defaultstate="collapsed" desc="imports">
import {ShouldUpdate} from 'utils/Utils';

// </editor-fold>

export default async function onSubmit(e, btn, onSaved) {
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

        const res = await this.verifyPhoneChange(form, old_data);
        if (res) {
            password_conf = res.password_conf;
            passwordVerified = res.passwordVerified;
            phoneUpdated = res.phoneUpdated;
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
        permissions_other_list
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

    const permissions_module_list = [
        ...(permissions_modules_sheq || []),
        ...(permissions_modules_hr || []),
        ...(permissions_modules_claims || []),
        ...(permissions_modules_extra || [])
    ];
    console.log("checkListPermissionsModules", permissions_module_list)
    console.log("checkListPermissionsOther", permissions_other_list)
    ShouldUpdate.checkListPermissionsModules(data, old_data, permissions_module_list);
    ShouldUpdate.checkListPermissionsOther(data, old_data, permissions_other_list);

    if (password_conf) {
        data.password_conf = password_conf;
    }

    this.updateUser({
        btn, data, phoneUpdated, passwordVerified, shouldSetupPermissions, onSaved,
        client, project, site
    });
}