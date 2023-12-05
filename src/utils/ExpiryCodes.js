import {Dates} from './Dates';

class ExpiryCodes {
    
    static daysPrev(expiry_date) {
        if (!expiry_date) return null;
        const d = new Date();
        const otherD = expiry_date instanceof Date ? expiry_date : Dates.parse(expiry_date);
        // console.log('ExpiryCodes.daysPrev', d.durationPrevDays(otherD))
        return d.durationPrevDays(otherD);
    }
    
    static daysNext(expiry_date) {
        if (!expiry_date) return null;
        const d = new Date();
        const otherD = expiry_date instanceof Date ? expiry_date : Dates.parse(expiry_date);
        // console.log('ExpiryCodes.daysNext', d.durationNextDays(otherD))
        return d.durationNextDays(otherD);
    }
    
    static color(expiry_date) {
        if (!expiry_date) return null;
        const d = new Date();
        const otherD = expiry_date instanceof Date ? expiry_date : Dates.parse(expiry_date);
        const {_data: {years, months, days, hours, minutes, seconds}} = d.durationNext(otherD);
        // console.log('ExpiryCodes.color', years, months, days, hours, minutes, seconds)
//        console.log('ExpiryCodes.color2', d.durationNextDays(otherD))
        let color;
        if (years === 0) {
            if (months < 0 || (months === 0 && days <= -1)) {
                color = 'grey';
            } else if ((months === 0 && days >= 1) || (months === 1 && days === 0)) {
                color = 'red';
            } else if ((months === 1 && days >= 1) || (months === 2 && days === 0)) {
                color = 'orange';
            } else if ((months === 2 && days >= 1) || (months === 3 && days === 0)) {
                color = 'yellow';
            } else {
                color = 'green';
            }
        } else if(years < 0) {
            color = 'grey';
        } else {
            color = 'green';
        }
        return color;
    }

    static greyOrGreenColor(expiry_date) {
        if (!expiry_date) return null;
        const d = new Date();
        const otherD = expiry_date instanceof Date ? expiry_date : Dates.parse(expiry_date);
        const {_data: {years, months, days, hours, minutes, seconds}} = d.durationNext(otherD);
        // console.log('ExpiryCodes.greyOrGreenColor', years, months, days, hours, minutes, seconds)
//        console.log('ExpiryCodes.color2', d.durationNextDays(otherD))
        let color;
        if (years === 0) {
            if (months < 0 || (months === 0 && days <= -1)) {
                color = 'grey';
            } else {
                color = 'green';
            }
        } else if(years < 0) {
            color = 'grey';
        } else {
            color = 'green';
        }
        return color;
    }
    
    static colorCode(expiry_date) {
        if (!expiry_date) return {};
        let color = ExpiryCodes.color(expiry_date);
        return {'grey': -1, 'red': 1, 'orange': 2, 'yellow': 3, 'green': 4}[color];
    }

    static colorClassName(expiry_date) {
        if (!expiry_date) return '';
        const color = ExpiryCodes.color(expiry_date);
        if (color) {
            return color + ' color-light';
        } else {
            return '';
        }
    }
    
    static greyOrGreenColorClassName(expiry_date) {
        if (!expiry_date) return '';
        const color = ExpiryCodes.greyOrGreenColor(expiry_date);
        if (color) {
            return color + ' color-light';
        } else {
            return '';
        }
    }
}

export default ExpiryCodes;