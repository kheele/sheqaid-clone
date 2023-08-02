import React from "react";
import {observer} from 'mobx-react';
import Carousel from "./Carousel";
import {computed, isObservableArray} from "mobx";

@observer
class SliderWithChildren extends React.Component {

	constructor(props) {
		super(props);

		this.renderItem = this.renderItem.bind(this);
	}

	@computed get sliderIndex() {
		return this.refs.slider.index;
	}

	renderItem(item, n, onClick) {
		const {children, rowClassName} = this.props;
		return <div className={`row${rowClassName ? ` ${rowClassName}` : ''}`}>
			{React.Children.map(children, (child, index) => {
				let {valKey, defaultValueKey} = child.props;

				const props = {};
				if(defaultValueKey) {
					if(isFunction(defaultValueKey)) {
						props.defaultValue = defaultValueKey(item);
					} else {
						props.defaultValue = item[defaultValueKey];
					}
				} else if(valKey) {
					if(isFunction(valKey)) {
						props.value = valKey(item);
					} else {
						props.value = item[valKey];
					}
				}

				return React.cloneElement(child, props);
			})}
		</div>;
	}

	render() {
		const {list, createDefault, indexFilter, onClick} = this.props;
		if(!list) return null;
		if(!isArray(list) && !isObservableArray(list)) return null;

		const index = isFunction(indexFilter) ? list.indexOfWithPredicate(indexFilter) : 0;
		return <Carousel
			ref="slider"
			index={index}
			renderer={this.renderItem}
			list={list}
			splitBy={1}
			colSize="col-lg-12"
			onClick={onClick}
		/>
	}
}

export default SliderWithChildren;