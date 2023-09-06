import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from '../../utils/Form';
import {ClearableInput} from './';

import ASelectInput from './ASelectInput';

@observer
class SelectInput extends ASelectInput {

	@observable
	state = {
		lists: {
			list: []
		},
		props: null,
		selectedVal: null
	};

	constructor(props) {
		super(props);

		const {name} = this.props;
		this.form = new Form();
		this.form.addChangeOne(name || "client", this.onChange.bind(this));
	}

	componentWillMount() {
		const {group, showAll} = this.props;
		window['selectClientInput' + (group || "")] = this;

		const {defaultValue, client} = this.props;
		if (defaultValue) {
			this.state.selectedVal = defaultValue;
		} else {
			let {selected, list: {clients = []}} = storage;
			const {is: {isContractor,}, loggedContractor} = storage;
			if(isContractor) {
				const {data: {site_list = []}} = loggedContractor;
				const client_list = site_list.map(({site}) => site.client);
				clients = client_list;
			}
			const {user: {data: {client: my_client}}} = storage.loggedUser;
			let {selectedClient, selectedContractorClient} = storage.selected;

			if(isContractor) {
				if (my_client && selectedContractorClient && (my_client.id === selectedContractorClient.id)) {
					this.state.selectedVal = selectedContractorClient;
					return;
				}

				selectedContractorClient = client ? clients[parseInt(client)] : null;
				if (selectedContractorClient) {
					this.state.selectedVal = selectedContractorClient;
					return;
				}

				if (showAll) {
					return;
				}

				if (selected.selectedContractorClient) {
					this.state.selectedVal = selected.selectedContractorClient;
				}
			} else {
				if (my_client && selectedClient && (my_client.id === selectedClient.id)) {
					this.state.selectedVal = selectedClient;
					return;
				}

				selectedClient = client ? clients[parseInt(client)] : null;
				if (selectedClient) {
					this.state.selectedVal = selectedClient;
					return;
				}

				if (showAll) {
					return;
				}

				if (selected.selectedClient) {
					this.state.selectedVal = selected.selectedClient;
				}
			}
		}
	}

	componentDidMount() {
		let {className = ''} = this.props;
		className += ` SelectClientInput`;

//        execWhen(() => this.state.lists.list.length).then(() => {
		this.state.lists.list = this.clients;

		this.state.props = {
			ref: "input",
			key: new Date().getTime(),
			name: "client",
			type: "select",
			placeholder: "Company Name...",
			values: this.list,
			returnValue: true,
			add: false,
			...this.props,
			onChange: this.form.onChange,
			defaultValue: this.selectedClient,
			className
		};
//        });
	}

	componentWillUnmount() {
		const {group} = this.props;
		window['selectClientInput' + (group || "")] = null;
		delete window['selectClientInput' + (group || "")];
	}

	onChange(el, val) {
		this.selectedTmpVal = val;
		this.state.selectedVal = val;
		const {onChange, name, group} = this.props;
		onChange && onChange(val, name, this);
		setTimeout(() => {
			const selectProjectInput = window['selectProjectInput' + (group || "")];
			const selectSiteInput = window['selectSiteInput' + (group || "")];
			!!selectProjectInput && (selectProjectInput.client = val);
			!!selectSiteInput && (selectSiteInput.client = val);
//            this.selectedTmpVal = null;
		}, 100);
//
	}

	set value(value) {
		this.onChange(null, value);
//        console.log(`set value: ${value}`)
	}

	@computed
	get clients() {
		const {showAll, isBlacklisting} = this.props;
		const all = [];
		if (showAll) {
			all.push('All');
		}

		const {user: {data: {client: my_client}}} = storage.loggedUser;

		const list = [...all];
		// if(isBlacklisting && my_client) {
		//     list.push(...storage.list.clients.filter(v => v.id !== my_client.id));
		// } else {
		const {is: {isContractor}, loggedContractor} = storage;
		if (isContractor) {
			const {data: {site_list = []}} = loggedContractor;
			const client_list = site_list.map(({site}) => site.client);
			list.push(...client_list);
		} else {
			list.push(...storage.list.clients);
		}
		// }
		return list.map(val => {
			return {value: val === 'All' ? undefined : val, label: val === 'All' ? val : (val.name || val.data.name)};
		});
	}

	@computed
	get selectedClient() {
		if (this.selectedTmpVal) {
//            return this.selectedTmpVal;
		}

		const {showAll} = this.props;
		const {selectedVal} = this.state;

//        console.log('selectedClient', selectedVal)
		if (!selectedVal)
			return showAll ? {value: undefined, label: 'All'} : null;
		if (selectedVal.label && (selectedVal.value || selectedVal.value === undefined)) {
			return selectedVal;
		}
		if (selectedVal === 'All' || selectedVal === undefined) {
			return {value: undefined, label: selectedVal};
		}
		let {name, data} = selectedVal;
		const label = data ? data.name : name;
//        console.log('selectedClient label', {value: selectedVal, label})
		return {value: selectedVal, label};

//        let selectedVal;
//        if (defaultValue) {
//            selectedVal = defaultValue;
//        } else {
//            const {selected, input: {inputSelectedClient}, list: {clients}} = storage;
//            console.log('else inputSelectedClient defaultValue', defaultValue)
//            let selectedClient = client ? clients[parseInt(client)] : null;
//            if (!selectedClient) {
//                selectedClient = selected.selectedClient;
//            }
//            if (selectedClient) {
//                selectedVal = selectedClient;
//            }
////            if(inputSelectedClient) {
////                if(!excludeInputSelectedClient) {
////                    selectedVal = inputSelectedClient;
////                    console.log('inputSelectedClient', inputSelectedClient)
////                }
////            } else {
////                console.log('else inputSelectedClient defaultValue', defaultValue)
////                let selectedClient = client ? clients[parseInt(client)] : null;
////                if(!selectedClient) {
////                    selectedClient = selected.selectedClient;
////                }
////                if(selectedClient) {
////                    selectedVal = selectedClient;
////                }
////            }
//        }
//        console.log('selectedVal', selectedVal)
//        if (!selectedVal)
//            return showAll ? {value: 'All', label: 'All'} : null;
//        if (selectedVal.label && selectedVal.value) {
//            return selectedVal;
//        }
//        if (selectedVal === 'All') {
//            return {value: selectedVal, label: selectedVal};
//        }
//        let {name, data} = selectedVal;
//        const label = data ? data.name : name;
//        console.log('selectedVal label', {value: selectedVal, label})
//        return {value: selectedVal, label};
	}

	render() {
		const {isConsultant, isContractor, hasProjects} = storage.is;
		const {props} = this.state;
		if (!props) return null;

		return <ClearableInput {...props} key={new Date().getTime()} defaultValue={this.selectedClient}/>;
	}
}

export default SelectInput;
