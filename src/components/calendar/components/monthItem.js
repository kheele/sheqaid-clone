import * as React from 'react';

import {testIds} from '../data/tests';
import {getClasses} from '../utils/classes';

const MonthItem = (props) => {
	const { title, index, classPrefix = null, isActive = false, onClick } = props;
	const classes = ['calendar__year-month'];
	
	if (isActive) {
		classes.push('calendar__year-month--active');
	}
	
	const CMonthItem = getClasses(classes, classPrefix);
	const handlerClick = React.useCallback(() => onClick(index), [onClick, index]);
	
	return (
		<div
			className={CMonthItem}
			data-testid={testIds.monthItem}
			onClick={handlerClick}
		>
			{title}
		</div>
	);
};


export default React.memo(MonthItem);
