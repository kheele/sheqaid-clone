import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed, observable} from 'mobx';

import {execWhen} from '../../utils/Utils';

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
		this.form.addChangeOne(name || "site", this.onChange.bind(this));
	}

	componentWillMount() {
		const {group, showAll} = this.props;
		window['selectSiteInput' + (group || "")] = this;

		const {defaultValue, site} = this.props;
		if (defaultValue) {
			this.state.selectedVal = defaultValue;
		} else {
			const {is: {isContractor,}, loggedContractor} = storage;
			let __sites;
			if(isContractor) {
				let {id, data: {name, username, site_list = []}} = loggedContractor;
				__sites = site_list.map(val => val.site);
			} else {
				const {list: {sites = []}} = storage;
				__sites = sites;
			}

			const {selected,} = storage;

			const {user: {data: {site: my_site}}} = storage.loggedUser;
			let {selectedSite, selectedContractorSite} = storage.selected;

			if(isContractor) {
				if (my_site && selectedContractorSite && (my_site.id === selectedContractorSite.id)) {
					this.state.selectedVal = selectedContractorSite;
					return;
				}

				selectedContractorSite = site ? __sites[parseInt(site)] : null;
				if (selectedContractorSite) {
					this.state.selectedVal = selectedContractorSite;
					return;
				}

				if (showAll) {
					return;
				}

				if (selected.selectedContractorSite) {
					this.state.selectedVal = selected.selectedContractorSite;
				}
			} else {
				if (my_site && selectedSite && (my_site.id === selectedSite.id)) {
					this.state.selectedVal = selectedSite;
					return;
				}

				selectedSite = site ? __sites[parseInt(site)] : null;
				if (selectedSite) {
					this.state.selectedVal = selectedSite;
					return;
				}

				if (showAll) {
					return;
				}

				if (selected.selectedSite) {
					this.state.selectedVal = selected.selectedSite;
				}
			}
		}
	}

	componentWillUnmount() {
		const {group} = this.props;
		window['selectSiteInput' + (group || "")] = null;
		delete window['selectSiteInput' + (group || "")];
	}

	setProps() {
		let {className = ''} = this.props;
		className += ` SelectSiteInput`;

//        execWhen(() => this.state.lists.list.length).then(() => {
//         autorun(() => {
		this.state.props = {
			ref: "input",
			key: new Date().getTime(),
			name: "site",
			type: "select",
			placeholder: "Site Name...",
			values: this.sites,
			returnValue: true,
			add: false,
			...this.props,
			onChange: this.form.onChange,
			defaultValue: this.selectedSite,
			className
		};
		// });
	}

	onChange(el, val) {
		if (!val) {
			return;
		}

		this.selectedTmpVal = val;
		this.state.selectedVal = val;
		const {onChange, name} = this.props;
		onChange && onChange(val, name, this);
	}

	get isConsultant() {
		const {is: {isConsultant}} = storage;
		return isConsultant;
	}

	set client(selectedClient) {
		const {showAll} = this.props;

		if (selectedClient) {
			if (isObject(selectedClient)) {
				const id = selectedClient.id || selectedClient.value.id;

				const {is: {isContractor}, loggedContractor} = storage;
				if(isContractor) {
					let {id, data: {name, username, site_list = []}} = loggedContractor;
					site_list = site_list.map(val => val.site);
					if(id) {
						site_list = site_list.filter(val => !!val.client).filter(val => id === val.client.id);
					}
					this.state.lists.list = site_list;

					if (this.state.selectedVal) {
						if (this.state.lists.list.noneMatch(v => {
							const {id, value} = this.selectedVal;
							if (id && id === v.id) return true;
							if (value && value.id === v.id) return true;
							return false;
						})) {
							if (showAll) {
								this.state.selectedVal = {value: undefined, label: 'All'};
							}
						}
					}
				} else {
					selectedClient = storage.find.findClientById(id);

					let {site_list, data = {}, value = {}} = selectedClient;
					site_list = site_list || data.site_list || value.site_list;

					if (site_list) {
						if (this.isConsultant) {
							this.state.lists.list = site_list;
						} else {
							this.state.lists.list = storage.list.sites;//TODO: investigate this. why set to projects
						}
						if (this.state.selectedVal) {
							if (this.state.lists.list.noneMatch(v => {
								const {id, value} = this.selectedVal;
								if (id && id === v.id) return true;
								if (value && value.id === v.id) return true;
								return false;
							})) {
								if (showAll) {
									this.state.selectedVal = {value: undefined, label: 'All'};
								}
							}
						}
					} else {
						//TODO: check why this part run
						this.state.lists.list = [];
						console.log('selectedClient is null');

						if (showAll) {
							this.state.selectedVal = {value: undefined, label: 'All'};
						}
					}
				}
			} else {
				if (showAll) {
					this.state.selectedVal = {value: undefined, label: 'All'};
				}
			}
		} else {
			if (showAll) {
				this.state.selectedVal = {value: undefined, label: 'All'};
			}
			this.state.lists.list = [];
		}

		this.setProps();
	}

	set project(selectedProject) {
		if(storage.is.isContractor) return;

		const {showAll} = this.props;

		if (selectedProject) {
			if (isObject(selectedProject)) {
				const id = selectedProject.id || selectedProject.value.id;
				selectedProject = storage.find.findProjectById(id);

				let {site_list, data = {}, value = {}} = selectedProject;
				site_list = site_list || data.site_list || value.site_list;

				if (site_list) {
					this.state.lists.list = site_list;

					if (this.state.selectedVal) {
						if (this.state.lists.list.noneMatch(v => {
							const {id, value} = this.selectedVal;
							if(id && id === v.id) return true;
							if(value && value.id === v.id) return true;
							return false;
						})) {
							if (showAll) {
								this.state.selectedVal = {value: undefined, label: 'All'};
							}
						}
					}
				} else {
					//TODO: check why this part run
					this.state.lists.list = [];
					console.error('selectedProject is null');

					if (showAll) {
						this.state.selectedVal = {value: undefined, label: 'All'};
					}
				}
			} else {
				if (showAll) {
					this.state.selectedVal = {value: undefined, label: 'All'};
				}
			}
		} else {
			if (showAll) {
				this.state.selectedVal = {value: undefined, label: 'All'};
			}
			this.state.lists.list = [];
		}

		this.setProps();
	}

	set value(value) {
		this.onChange(null, value);
		console.log(`set value: ${value}`)
	}

	@computed get selectedVal() {
		return this.state.selectedVal;
	}

	@computed
	get sites() {
		const {showAll, isBlacklisting} = this.props;
		const all = [];
		if (showAll) {
			all.push('All');
		}
		const {is: {isContractor}, loggedContractor} = storage;
		if (isContractor) {
			const {id, data: {name, username, site_list = []}} = loggedContractor;

			return [...all, ...site_list].map(val => val.site || val).map(val => {
				return {value: val === 'All' ? undefined : val, label: val === 'All' ? val : val.name};
			});
		}

		const {user: {data: {site: my_site}}} = storage.loggedUser;

		const list = [...all];
		// if(isBlacklisting && my_site) {
		//     list.push(...this.state.lists.list.filter(v => v.id !== my_site.id));
		// } else {
		list.push(...this.state.lists.list);
		// }
		return list.map(val => {
			return {value: val === 'All' ? undefined : val, label: val === 'All' ? val : (val.name || val.data.name)};
		});
	}

	@computed
	get selectedSite() {
		const {showAll} = this.props;
		const {selectedVal} = this.state;

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
		return {value: selectedVal, label};
	}

	render() {
		const {props} = this.state;
		if (!props) return null;

		return <ClearableInput {...props} key={new Date().getTime()}/>;
	}
}

export default SelectInput;
