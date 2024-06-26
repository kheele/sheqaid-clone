// <editor-fold defaultstate="collapsed" desc="imports">
import {isValidPhoneNumber} from 'libphonenumber-js';

import {ShouldUpdate} from 'utils/Utils';

// </editor-fold>

export default async function (form, old_data) {
    const returnRes = {};

    const data_test = {};
    ShouldUpdate.check(data_test, old_data, this.phoneNumberNew, 'phone');

    if (Object.values(data_test).isNotEmpty()) {
        if (form.isValid('country') && !form.isValid('phone')) {
            infoDialog.open('Phone Number required');
            return "REQ_PHONE";
        }
        if (!form.isValid('country') && form.isValid('phone')) {
            infoDialog.open('Phone Code required');
            return "REQ_CODE";
        }
        if (form.isValid('country') && form.isValid('phone')) {
            const isValid = isValidPhoneNumber(String(form.get('phone')), form.get('country').data.iso2);
            if (!isValid) {
                infoDialog.open('Phone Number is not valid');
                return "INVALID_PHONE";
            } else {
                const text = await inputDialog.password().open("Enter Password");
                if (!text) {
                    infoDialog.open('Password is required');
                    return "REQ_PASSWORD";
                }

                returnRes.password_conf = text;
                returnRes.passwordVerified = true;

                const res = await this.refs.setupPhoneNumDialog.extraProp('isoCode', form.get('country').data.iso2).extraProp('phoneNumber', form.get('phone')).open(storage.loggedUser).then(res => {
                    console.log('setupPhoneNumDialog res', res);
                    return res;
                });
                if (!res) {
                    return "NO_PHONE_SETUP";
                }
                returnRes.phoneUpdated = res;
                return returnRes;
            }
        } else {
            return "NO_COUNTRY_AND_PHONE";
        }
    }
    return "NO_CHANGE";
};
