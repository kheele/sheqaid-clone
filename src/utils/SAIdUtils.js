import {Dates} from './Dates';

class SAIdUtils {
    static isValid(val) {
        if (isNumber(val))
            val = String(val);
        if (!!val && val.length === 13 && val.isNumeric()) {
            const tempDate = new Date(val.substring(0, 2), val.substring(2, 4) - 1, val.substring(4, 6));

            const id_date = tempDate.getDate();
            const id_month = tempDate.getMonth();

            if (!((tempDate.getYear() === parseInt(val.substring(0, 2))) && (id_month === parseInt(val.substring(2, 4) - 1)) && (id_date === parseInt(val.substring(4, 6))))) {
                return false;
            }
            return true;
        }
        return false;
    }

    static getDOB(val) {
        if (isNumber(val))
            val = String(val);
        if (SAIdUtils.isValid(val)) {
            let y = val.substring(0, 2);
            if(y === "00") {
                y = "2000";
            }
            return new Date(y, val.substring(2, 4) - 1, val.substring(4, 6));
        }
    }

    static getAge(val) {
        if (isNumber(val))
            val = String(val);
        if (SAIdUtils.isValid(val)) {
            let birthDate = new Date();

            birthDate.setFullYear(parseInt(val.substring(0, 2)) + 2000);
            birthDate.setMonth(parseInt(val.substring(2, 4)) - 1);
            birthDate.setDate(parseInt(val.substring(4, 6)));
            const today = new Date();
            if (birthDate.getTime() > today.getTime()) {
                birthDate = new Date(val.substring(0, 2), val.substring(2, 4) - 1, val.substring(4, 6));
            }

            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }
    }

    static getAgeFromDate(val) {
        if (isNumber(val))
            val = Dates.parse(val);
        if (!isDate(val))
            return null;

        const birthDate = val;
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    static getGender(val) {
        if (isNumber(val))
            val = String(val);
        if (SAIdUtils.isValid(val)) {
            const genderCode = val.substring(6, 10);
            const gender = parseInt(genderCode) < 5000 ? "Female" : "Male";
            return gender;
        }
    }
}

export default SAIdUtils;