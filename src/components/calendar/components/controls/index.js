import React from 'react';

import {testIds} from '../../data/tests';
import {getClasses} from '../../utils/classes'

import ArrowButton from './arrowButton';
import ViewButton from './viewButton';

const Controls = (props) => {
	const {
		active,
		activeView,
		monthTitles,
		classPrefix = null,
		onSwitchDirection,
		onSwitchView,
	} = props;
	
	const CControls = getClasses(['calendar__controls'], classPrefix);
	const monthTitle = React.useMemo(
		() => (monthTitles[active.month]), [active, monthTitles]
	);

	const handlerSwitchDirection = React.useCallback(
		(direction) => onSwitchDirection(direction), [onSwitchDirection]
	);
	
	const handlerSwitchView = React.useCallback(
		(view) => onSwitchView(view), [onSwitchView]
	);
	
	return (
		<div className={CControls} data-testid={testIds.controls}>
			<ArrowButton
				direction="prev"
				activeView={activeView}
				classPrefix={classPrefix}
				onClick={handlerSwitchDirection}
			/>
			<ViewButton
				title={monthTitle}
				view="month"
				targetView="year"
				classPrefix={classPrefix}
				onClick={handlerSwitchView}
			/>
			<ViewButton
				title={active.year}
				view="year"
				targetView="decade"
				classPrefix={classPrefix}
				onClick={handlerSwitchView}
			/>
			<ArrowButton
				direction="next"
				activeView={activeView}
				classPrefix={classPrefix}
				onClick={handlerSwitchDirection}
			/>
		</div>
	);
};

export default React.memo(Controls);
