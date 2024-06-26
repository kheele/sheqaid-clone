// <editor-fold defaultstate="collapsed" desc="imports">
import {ShouldUpdate} from 'utils/Utils';

// </editor-fold>

export default async function (form, old_data) {
    const returnRes = {};

    const data_test = {};
    ShouldUpdate.check(data_test, old_data, this.usernameNew, 'username');

    if (Object.values(data_test).isNotEmpty()) {
        if (!form.isValid('username')) {
            infoDialog.open('Email Address is required');
            return "REQ_EMAIL";
        } else if (!form.get('username').isEmailAddress()) {
            infoDialog.open('Email Address is not valid');
            return "INVALID_EMAIL";
        }

        const text = await inputDialog.password().open("Enter Password");
        if (!text) {
            infoDialog.open('Password is required');
            return "REQ_PASSWORD";
        }

        returnRes.password_conf = text;
        returnRes.passwordVerified = true;

        return returnRes;
    }
    return "NO_CHANGE";
};
