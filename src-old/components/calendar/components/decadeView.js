import React from 'react';

import {testIds} from '../data/tests';
import {getClasses} from '../utils/classes';
import YearItem from './yearItem';

const DecadeView = (props) => {
	const {
		decade,
		activeView,
		activeYear = null,
		classPrefix = null,
		onClick
	} = props;
	const CDecadeView = getClasses(['calendar__decade'], classPrefix);

	const handlerClick = React.useCallback(
		(year) => onClick(year), [onClick]
	);

	if (activeView !== 'decade') {
		return null;
	}
	
	return (
		<div
			className={CDecadeView}
			data-testid={testIds.decadeView}
		>
			{
				decade.map((year) => (
					<YearItem
						key={year}
						year={year}
						isActive={year === activeYear}
						classPrefix={classPrefix}
						onClick={handlerClick}
					/>
				))
			}
		</div>
	);
};

export default React.memo(DecadeView);
