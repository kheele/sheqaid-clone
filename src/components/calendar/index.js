import React from 'react';

import {testIds} from './data/tests';
import useDecade from './hooks/useDecade';
import {getLocalizedNames} from './utils/localization';
import {getCalendarData, getNext, getPrev, getYearAndMonth} from './utils';
import {getClasses} from './utils/classes';
import {getMarkedDays} from './utils/getMarkedDays';

import Controls from './components/controls';
import MonthView from './components/monthView';
import YearView from './components/yearView';
import DecadeView from './components/decadeView';

const Calendar = (props) => {
    const {
        renderer,
        firstDayIsMonday = true,
        date = null,
        selectDay = false,
        markers = [],
        locale = 'en-US',
        classPrefix = null,
        onSelectDay = () => {
        }
    } = props;

    const CMainComponent = getClasses(['calendar'], classPrefix);

    const [active, setActive] = React.useState(() => getYearAndMonth(date));
    const [current, setCurrent] = React.useState(active);
    const [selected, setSelected] = React.useState(selectDay ? date : null);
    const [activeView, setActiveView] = React.useState('month');
    const {decade, switchDecade} = useDecade(current.year);
    const markedDays = React.useMemo(() => getMarkedDays(markers), [markers]);
    const calendarData = React.useMemo(
            () => getCalendarData({active, selected, markers: markedDays, firstDayIsMonday}),
            [active, selected, markers, firstDayIsMonday],
            );
    const {weekdays, months} = getLocalizedNames({locale, firstDayIsMonday});
    const activeMonth = React.useMemo(
            () => (active.year === current.year ? active.month : null),
            [active, current]
            );

    const switchMonth = React.useCallback((direction) => {
        if (direction === 'prev') {
            setActive(getPrev(active));

            return;
        }

        if (direction === 'next') {
            setActive(getNext(active));

            return;
        }
    }, [active]);

    const handleSwitchDirection = React.useCallback((direction) => {
        if (activeView === 'month') {
            switchMonth(direction);
        }

        if (activeView === 'decade') {
            switchDecade(direction);
        }
    }, [activeView, switchMonth, switchDecade]);

    const handlerSwitchView = React.useCallback((view) => {
        setActiveView(view);
    }, []);

    const handlerSelectDay = React.useCallback((day) => {
        if (day.month !== 'current') {
            switchMonth(day.month);
        }

        if (selected && day.day === selected.getTime()) {
            setSelected(null);
            onSelectDay(null);
            return;
        }

        setSelected(new Date(day.date));
        onSelectDay(new Date(day.date));
    }, [switchMonth, onSelectDay]);

    const handlerSelectMonth = React.useCallback((month) => {
        const {year} = current;

        setCurrent({year, month});
        setActive({year, month});
        setActiveView('month');
    }, [current, setActive]);

    const handlerSelectYear = React.useCallback((year) => {
        const {month} = current;

        setCurrent({year, month});
        setActiveView('year');
    }, [current, setActive]);

    React.useEffect(() => setCurrent(active), [active]);
    
    return (<div className={CMainComponent} data-testid={testIds.calendar}>
	<Controls
            active={current}
            activeView={activeView}
            monthTitles={months}
            classPrefix={classPrefix}
            onSwitchDirection={handleSwitchDirection}
            onSwitchView={handlerSwitchView}
	/>
	<MonthView
            renderer={renderer}
            data={calendarData}
            activeView={activeView}
            firstDayIsMonday={firstDayIsMonday}
            weekdayTitles={weekdays}
            classPrefix={classPrefix}
            onClick={handlerSelectDay}
	/>
	<YearView
            activeMonth={activeMonth}
            activeView={activeView}
            monthTitles={months}
            classPrefix={classPrefix}
            onClick={handlerSelectMonth}
	/>
	<DecadeView
            decade={decade}
            activeYear={active.year}
            activeView={activeView}
            classPrefix={classPrefix}
            onClick={handlerSelectYear}
	/>
    </div>);
};

export default React.memo(Calendar);
