
class ExpiryCodes {
    static color(expiry_date) {
        const d = new Date();
        const {_data: {months, days, hours, minutes, seconds}} = d.durationNext(Dates.parse(expiry_date));

        let color;
        if (months <= 0 && days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
            color = 'grey';
        } else if (months === 0) {
            color = 'red';
        } else if (months === 1) {
            color = 'orange';
        } else if (months === 2) {
            color = 'yellow';
        } else {
            color = 'green';
        }
        return color;
    }

    static colorCode(expiry_date) {
        let color = ExpiryCodes.color(expiry_date);
        return {'grey': -1, 'red': 1, 'orange': 2, 'yellow': 3, 'green': 4}[color];
    }

    static colorClassName(expiry_date) {
        return ExpiryCodes.color(expiry_date) + ' color-light';
    }
}

Number.prototype.rangeExpiryCodes = function(val) {
    return ExpiryCodes.colorCode(this) === val;
};