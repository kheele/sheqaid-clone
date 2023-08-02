import React from 'react';

import {testIds} from '../../data/tests';
import {getArrowButtonClass} from '../../utils/classes'

const ArrowButton = (props) => {
	const { direction, classPrefix = null, activeView, onClick } = props;
	const button = React.useMemo(
		() => ({
			testId: direction === 'prev' ? testIds.controlsPrevBtn : testIds.controlsNextBtn,
			arrow: direction === 'prev' ? '<' : '>',
		}),
		[direction]
	);
	const CArrowButton = React.useMemo(
		() => getArrowButtonClass(direction, classPrefix, activeView),
		[direction, classPrefix, activeView]
	);
	const handlerClick = React.useCallback(() => {
		onClick(direction);
	}, [direction, onClick]);
	return (
		<span
			className={CArrowButton}
			data-testid={button.testId}
			onClick={handlerClick}
		>
			{button.arrow}
		</span>
	);
};

export default React.memo(ArrowButton);
