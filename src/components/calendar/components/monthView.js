import React from 'react';

import {getClasses} from '../utils/classes';
import {testIds} from '../data/tests';
import WeekdayTitles from './weekdayTitles';
import Day from './day';

const MonthView = (props) => {
	const {
        renderer,
		data,
		activeView,
		firstDayIsMonday,
		weekdayTitles,
		classPrefix = null,
		onClick,
	} = props;

	const CMonthView = getClasses(['calendar__month'], classPrefix);
	const handlerClick = React.useCallback((day) => onClick(day), [onClick]);
	
	if (activeView !== 'month') {
		return null;
	}
	
	return (
		<React.Fragment>
			<WeekdayTitles
				weekdayTitles={weekdayTitles}
				firstDayIsMonday={firstDayIsMonday}
				classPrefix={classPrefix}
			/>
			<div className={CMonthView} data-testid={testIds.monthView}>
				{
					data.map(day => (
						<Day
							key={day.timestamp}
                                                        renderer={renderer}
							day={day}
							classPrefix={classPrefix}
							onClick={handlerClick}
						/>
					))
				}
			</div>
		</React.Fragment>
	);
};

export default React.memo(MonthView);
