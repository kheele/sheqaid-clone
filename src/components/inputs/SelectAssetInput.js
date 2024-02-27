import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {ClearableInput} from './';

import ASelectInput from './ASelectInput';

@observer
class SelectInput extends ASelectInput {

	@observable
	state = {
		lists: {
			list: []
		},
		props: null
	};

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		let {className = '', onLoadFilter} = this.props;
		className += ` SelectAssetInput`;

		const res = await onSelectLoad(onLoadFilter);
		this.state.lists.list = res.distinct();

		this.state.props = {
			ref: "input",
			key: new Date().getTime(),
			name: "asset",
			type: "select",
			placeholder: "Asset...",
			values: this.list,
			returnValue: true,
			add: false,
			...this.props,
			defaultValue: this.selectedItem,
			className
		};
	}

	@computed
	get selectedItem() {
		const {defaultValue} = this.props;
		if (defaultValue) {
			if (defaultValue.label && defaultValue.value) {
				return defaultValue;
			}
			let {asset_detail, data} = defaultValue;
			asset_detail = asset_detail || data.asset_detail;
			const {name, asset_type} = asset_detail;
			const label = name + ' (' + asset_type + ')';
//            console.log('selectedVal', label)
			return {value: defaultValue, label};
		}
		return null;
	}

	render() {
		const {props} = this.state;
		if (!props) return null;

		return <ClearableInput {...props}/>;
	}
}

function onSelectLoad(onLoadFilter) {
	const filter = isFunction(onLoadFilter) && onLoadFilter();
	const listByLogged = sockets.of("assets").fn('listByLogged');
	
	return listByLogged({
		written_off: false,
		//
		...(filter || {}),
		//
		exact_orgs: true,
		//
		limit: 0,
		offset: 0,
	}).then((res) => {
		return res.map(value => {
			const {data: {asset_detail: {name, asset_type}}} = value;
			return {label: name + ' (' + asset_type + ')', value};
		});
	});
}

export default SelectInput;
