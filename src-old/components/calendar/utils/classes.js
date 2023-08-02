
const defaultClassPrefix = 'rgc';

export const getPrefixes = (prefix) => {
    if (!prefix) {
        return [defaultClassPrefix];
    }

    if (typeof prefix === 'string') {
        return [defaultClassPrefix, prefix];
    }

    return [defaultClassPrefix, ...prefix];
};

export const getClasses = (classes, prefix) => {
    const prefixes = getPrefixes(prefix);

    const classNames = prefixes.reduce((acc, prefix) => {
        const cn = classes.reduce((prev, className) => ([...prev, `${prefix}-${className}`]), []);

        return [...acc, ...cn];
    }, []);

    return classNames.join(' ');
};

export const getConditionalClasses = (classesObject) => {
    return Object.keys(classesObject).filter(key => (!!classesObject[key]));
};

export const getArrowButtonClass = (btn, classPrefix, activeView) => {
    const buttonClasses = ['calendar__btn', `calendar__btn-${btn}`];

    if (activeView === 'year') {
        buttonClasses.push('calendar__btn--blocked');
    }

    return getClasses(buttonClasses, classPrefix);
};

export const getDayClasses = (day, classPrefix) => {
    const conditionalClasses = getConditionalClasses({
        'calendar__day--today': day.isToday,
        [`calendar__day--${day.month}`]: day.month !== 'current',
        'calendar__day--weekend': day.isWeekend,
        'calendar__day--selected': day.isSelected,
        'calendar__day--has-marker': day.hasMarker
    });
    const classes = ['calendar__day', ...conditionalClasses];

    return getClasses(classes, classPrefix);
};
