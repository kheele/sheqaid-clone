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
		let {className = ''} = this.props;
		className += ` SelectPPEItemInput`;
		
		const res = await onSelectLoad();
		this.state.lists.list = res.distinct();
		
		this.state.props = {
			ref: "input",
			key: new Date().getTime(),
			name: "ppe_item",
			type: "select",
			placeholder: "PPE Item...",
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
			const {ppe_type: {name, unit}, serial_num, profile_pic} = defaultValue.data || defaultValue;
			const label = `${name} - ${serial_num}`;
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

function onSelectLoad() {
	const listByLogged = sockets.of('ppe-items').fn('listByLogged');
	
	return listByLogged({
		exact_orgs: true,
		//
		limit: 0,
		offset: 0,
	}).then(res => {
		return res.map(value => {
			const {ppe_type: {name, unit}, serial_num, profile_pic} = value.data;
			let label = `${name} - ${serial_num}`;
			return {label, value};
		});
	});
}

export default SelectInput;
