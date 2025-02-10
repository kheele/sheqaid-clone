import {observer} from "mobx-react";
import React from "react";
import {ClearableInput} from "./index";
import {computed, isObservableArray, observable} from "mobx";
import {execWhen} from "utils/UtilsFuns";
import {Grid} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import GQLClient from "graphql/GQLClient";
import ASelectInput from "./ASelectInput";

@observer
class SelectInput extends ASelectInput {

	@observable
	state = {
		lists: {
			list: ['Drug', 'Alcohol', 'Mobile Device'].map(value => {
				return {value, text: value, checked: false}
			}),
		},
		props: null,
		loaded: null
	};

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		let {className = ''} = this.props;
		className += ` SelectIncidentTestTypeInput`;

		const {type} = this.props;

		this.state.props = {
			ref: "input",
			key: new Date().getTime(),
			name: "test_type_list",
			type: type || "multi_select",
			placeholder: "Type Of Test(s) Undertaken",
			values: this.list,
			returnValue: true,
			add: false,
			...this.props,
			defaultValue: this.selectedItem,
			className
		};
		this.state.loaded = true;
	}

	@computed
	get selectedItem() {
		const {defaultValue} = this.props;
		if (defaultValue) {
			if (defaultValue.label && defaultValue.value) {
				return defaultValue;
			}
			return {value: defaultValue, label: defaultValue};
		}
		return null;
	}

	render() {
		const {props} = this.state;
		if (!props) return null;

		return <ClearableInput {...props}/>;
	}
}

export default SelectInput;