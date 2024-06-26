// <editor-fold defaultstate="collapsed" desc="imports">
import {extendObservable} from 'mobx';
import updateUser from "mutations/all/User/updateUser";
import updateNotificationSetting from "mutations/all/NotificationSetting/updateNotificationSetting";
import insertNotificationSetting from "mutations/all/NotificationSetting/insertNotificationSetting";

// </editor-fold>

export default function (el, val, action) {//ADDED / REMOVED
    let {item: {id, data: old_data, data: {notifications_settings}}} = this;

    const input = el.getDOMNode().querySelector('input');
    console.log('onUpdateNotificationPermission', input.name, val, action, notifications_settings);//{checked, name}
    // return;

    const {name: key} = input;
    if (!notifications_settings) {
        el.setReadonly(true);

        notifications_settings = {
            [key]: action === 'ADDED',
        };

        insertNotificationSetting(notifications_settings).then(notifications_settings_res => {
            if (!notifications_settings_res) {
                return infoDialog.open("Record couldn't be updated. Please try again later.");
            }
            return updateUser({id, notifications_settings_id: notifications_settings_res.id}).then(res => {
                console.log("res", res)
                if (res) {
                    extendObservable(old_data, {notifications_settings: notifications_settings_res.data});
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    return true;
                } else {
                    infoDialog.open("Record couldn't be updated. Please try again later.");
                }
            });
        }).catch(err => {
            console.error(err);
            infoDialog.open("Record couldn't be updated. Please try again later.");
        }).finally(() => {
            el.setReadonly(false);
        });
    } else {
        el.setReadonly(true);

        const attrs = {[key]: action === 'ADDED'};

        updateNotificationSetting({id: notifications_settings.id, ...attrs}).then(res => {
            console.log("res", res)
            if (res) {
                notifications_settings[key] = action === 'ADDED';
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
};
