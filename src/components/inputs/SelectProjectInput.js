import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed, observable, toJS} from 'mobx';

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
	isRunning = false;
	
	constructor(props) {
		super(props);
		
		if (storage.is.isContractor) return;
		
		const {name} = this.props;
		this.form = new Form();
		this.form.addChangeOne(name || "project", this.onChange.bind(this));
	}
	
	componentWillMount() {
		if (storage.is.isContractor) return;
		
		const {group, showAll} = this.props;
		window['selectProjectInput' + (group || "")] = this;
		
		const {defaultValue, project} = this.props;
		if (defaultValue) {
			this.state.selectedVal = defaultValue;
		} else {
			const {selected, list: {projects = []}} = storage;
			const {user: {data: {project: my_project}}} = storage.loggedUser;
			if (my_project && selected.selectedProject && (my_project.id === selected.selectedProject.id)) {
				this.state.selectedVal = selected.selectedProject;
				return;
			}
			
			let selectedProject = project ? projects[parseInt(project)] : null;
			if (selectedProject) {
				this.state.selectedVal = selectedProject;
				return;
			}
			
			if (showAll) {
				return;
			}
			
			if (selected.selectedProject) {
				this.state.selectedVal = selected.selectedProject;
			}
		}
	}
	
	componentDidMount() {
		if (storage.is.isContractor) return;
		
		if (!this.isConsultant) {
			const {loggedUser: {company}} = storage;
			this.company = company;
		}
	}
	
	componentWillUnmount() {
		if (storage.is.isContractor) return;
		
		const {group} = this.props;
		window['selectProjectInput' + (group || "")] = null;
		delete window['selectProjectInput' + (group || "")];
	}
	
	setProps() {
		// if(!this.isRunning) {
		// 	this.isRunning = setTimeout(() => {
		let {className = ''} = this.props;
		className += ` SelectProjectInput`;
		
		this.state.props = {
			ref: "input",
			// key: new Date().getTime(),
			name: "project",
			type: "select",
			placeholder: "Project Name...",
			values: this.projects,
			returnValue: true,
			add: false,
			...this.props,
			onChange: this.form.onChange,
			defaultValue: this.selectedProject,
			className
		};
		// 		this.isRunning = null;
		// 	}, 1000);
		// }
	}
	
	onChange(el, val) {
		if (!val) {
			return;
		}
		
		this.selectedTmpVal = val;
		
		this.state.selectedVal = val;
		
		const {onChange, name, group} = this.props;
		onChange && onChange(val, name, this);
		// setTimeout(() => {
		const selectSiteInput = window['selectSiteInput' + (group || "")];
		!!selectSiteInput && (selectSiteInput.project = val);
//            this.selectedTmpVal = null;
//         }, 200);
	}
	
	get isConsultant() {
		const {is: {isConsultant}} = storage;
		return isConsultant;
	}
	
	set company(_) {
		const {showAll} = this.props;
		
		this.state.lists.list = storage.list.projects;
		
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
		
		this.setProps();
	}
	
	set client(selectedClient) {
		const {showAll} = this.props;
		
		if (selectedClient) {
			if (isObject(selectedClient)) {
				const id = selectedClient.id || selectedClient.value.id;
				selectedClient = storage.find.findClientById(id);
				
				let {project_list, data = {}, value = {}} = selectedClient;
				project_list = project_list || data.project_list || value.project_list;
				
				if (project_list) {
					if (this.isConsultant) {
						this.state.lists.list = project_list;
					} else {
						this.state.lists.list = storage.list.projects;
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
	get projects() {
		const {showAll, isBlacklisting} = this.props;
		const all = [];
		if (showAll) {
			all.push('All');
		}
		
		const {user: {data: {project: my_project}}} = storage.loggedUser;
		
		const list = [...all];
		// if(isBlacklisting && my_project) {
		//     list.push(...this.state.lists.list.filter(v => v.id !== my_project.id));
		// } else {
		list.push(...this.state.lists.list);
		// }
		return list.map(val => {
			return {value: val === 'All' ? undefined : val, label: val === 'All' ? val : (val.name || val.data.name)};
		});
	}
	
	@computed
	get selectedProject() {
		const {showAll} = this.props;
		const {selectedVal} = this.state;
		
		if (!selectedVal) {
			return showAll ? {value: undefined, label: 'All'} : null;
		}
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
		if (storage.is.isContractor) return null;
		const {props} = this.state;
		if (!props) return null;
		
		return <ClearableInput {...props} key={new Date().getTime()}/>;
	}
}

export default SelectInput;
