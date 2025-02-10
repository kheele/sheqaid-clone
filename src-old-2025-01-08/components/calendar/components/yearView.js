import React from 'react';

import {testIds} from '../data/tests';
import MonthItem from './monthItem';
import {getClasses} from '../utils/classes';

const YearView = (props) => {
	const {
		activeMonth = null,
		activeView, monthTitles,
		classPrefix = null,
		onClick
	} = props;
	const CYearView = getClasses(['calendar__year'], classPrefix);
	
	const handlerClick = React.useCallback(
		(index) => onClick(index),
		[onClick]
	);

	if (activeView !== 'year') {
		return null;
	}
	
	return (
		<div className={CYearView} data-testid={testIds.yearView}>
			{
				monthTitles.map((title, i) => (
					<MonthItem
						key={title}
						title={title}
						index={i}
						isActive={activeMonth === i}
						classPrefix={classPrefix}
						onClick={handlerClick}
					/>
				))
			}
		</div>
	);
};

export default React.memo(YearView);
