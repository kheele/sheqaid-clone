import React from "react";
import {observer} from 'mobx-react';
import Carousel from "./Carousel";
import {computed, isObservableArray} from "mobx";
import {execWhen} from "utils/Utils";

@observer
class SliderWithChildren extends React.Component {

	constructor(props) {
		super(props);

		this.renderItem = this.renderItem.bind(this);

		this.move = this.move.bind(this);
		this.moveStart = this.moveStart.bind(this);
		this.moveEnd = this.moveEnd.bind(this);
		this.next = this.next.bind(this);
		this.prev = this.prev.bind(this);
	}

	componentDidMount() {
		execWhen(() => this.refs.slider).then(slider => {
			const {list, indexFilter} = this.props;
			if (list && list.isNotEmpty()) {
				const index = isFunction(indexFilter) ? list.indexOfWithPredicate(indexFilter) : 0;
				this.move(index);
			}
		});
	}

	@computed get sliderIndex() {
		return this.refs.slider.index;
	}

	move(n) {
		this.refs.slider.move(n);
	}

	moveStart() {
		this.refs.slider.moveStart();
	}

	moveEnd() {
		this.refs.slider.moveEnd();
	}

	next() {
		this.refs.slider.next();
	}

	prev() {
		this.refs.slider.prev();
	}

	renderItem(item, n, onClick) {
		const {children, rowClassName} = this.props;
		return <div className={`row${rowClassName ? ` ${rowClassName}` : ''}`}>
			{React.Children.map(children, (child, index) => {
				let {valKey, defaultValueKey} = child.props;

				const props = {};
				if (defaultValueKey) {
					if (isFunction(defaultValueKey)) {
						props.defaultValue = defaultValueKey(item);
					} else {
						props.defaultValue = item[defaultValueKey];
					}
				} else if (valKey) {
					if (isFunction(valKey)) {
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
		if (!list) return null;
		if (!isArray(list) && !isObservableArray(list)) return null;

		return <Carousel
			ref="slider"
			renderer={this.renderItem}
			list={list}
			splitBy={1}
			colSize="col-lg-12"
			onClick={onClick}
		/>
	}
}

export default SliderWithChildren;