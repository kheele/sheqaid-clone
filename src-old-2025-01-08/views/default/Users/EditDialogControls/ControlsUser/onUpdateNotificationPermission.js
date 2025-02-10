// <editor-fold defaultstate="collapsed" desc="imports">
import {extendObservable} from 'mobx';
import {upsertNotificationSetting} from "mutations/upsert";

// </editor-fold>

export default function (el, val, action) {//ADDED / REMOVED
    let {item: {id, data: old_data, data: {notifications_settings}}} = this;

    const input = el.getDOMNode().querySelector('input');
    console.log('onUpdateNotificationPermission', input.name, val, action, notifications_settings);//{checked, name}
    // return;

    el.setReadonly(true);

    const {name: key} = input;
    upsertNotificationSetting({user_id: id, ...input, notifications_settings}).then(res => {
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
};
