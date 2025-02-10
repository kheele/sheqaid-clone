import React from 'react';

import {testIds} from '../data/tests';
import {getDayClasses} from '../utils/classes';

const Day = (props) => {
	const {renderer, day, classPrefix = null, onClick } = props;
	const CDay = getDayClasses(day, classPrefix);
	
	const handlerClick = React.useCallback(() => onClick(day), [onClick, day]);
	
	return (
		<span
			key={day.timestamp}
			className={CDay}
			onClick={handlerClick}
			data-testid={testIds.day}
		>
			{day.day}
                        {renderer && renderer(day)}
		</span>
	);
};

export default React.memo(Day);
