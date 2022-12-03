import React from 'react';

export const getDecade = (year) => {
    const decade = [];
    const firstYear = year - (year % 10);
    const lastYear = firstYear + 9;

    for (let i = firstYear; i <= lastYear; i++) {
        decade.push(i);
    }

    return decade;
};

export const useDecade = (currentYear) => {
    const [decade, setDecade] = React.useState(() => getDecade(currentYear));

    const handlerSwitchDecade = React.useCallback((direction) => {
        if (direction === 'prev') {
            setDecade(getDecade(decade[0] - 10));
            return;
        }

        setDecade(getDecade(decade[0] + 10));
    }, [decade]);

    return {decade, switchDecade: handlerSwitchDecade};
};

export default useDecade;
