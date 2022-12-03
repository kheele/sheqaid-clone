import React from 'react';

import {testIds} from '../data/tests';
import {getClasses} from '../utils/classes';

const YearItem = (props) => {
	const { year, isActive = false, classPrefix = null, onClick } = props;
	const classes = ['calendar__decade-year'];

	if (isActive) {
		classes.push('calendar__decade-year--active');
	}
	
	const CYearItem = getClasses(classes, classPrefix);
	
	const handlerClick = React.useCallback(() => onClick(year), [onClick, year]);
	
	return (
		<div
			className={CYearItem}
			data-testid={testIds.yearItem}
			onClick={handlerClick}
		>
			{year}
		</div>
	);
};

export default React.memo(YearItem);
