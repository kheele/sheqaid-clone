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
        this.form.addChangeOne(name || "project", this.onChange.bind(this));
    }

    componentWillMount() {
        const {group, showAll} = this.props;
        window['selectProjectInput' + (group || "")] = this;

        const {defaultValue, project} = this.props;
        if (defaultValue) {
            this.state.selectedVal = defaultValue;
        } else {
            const {selected, list: {projects = []}} = storage;
            const {user: {data: {project: my_project}}} = storage.loggedUser;
            if(my_project && selected.selectedProject && (my_project.id === selected.selectedProject.id)) {
                this.state.selectedVal = selected.selectedProject;
                return;
            }
            
            let selectedProject = project ? projects[parseInt(project)] : null;
            if (selectedProject) {
                this.state.selectedVal = selectedProject;
                return;
            }
            
            if(showAll) {
                return;
            }
            
            if(selected.selectedProject) {
                this.state.selectedVal = selected.selectedProject;
            }
        }
    }

    componentDidMount() {
        if(storage.is.isContractor) return;
        
        if(!this.isConsultant) {
            const {loggedUser: {company}} = storage;
            this.client = company;
        }
        
        let {className = ''} = this.props;
        className += ` SelectProjectInput`;
       
//        execWhen(() => this.state.lists.list.length).then(() => {
        autorun(() => {
            this.state.props = {
                ref: "input",
                key: new Date().getTime(),
                name: "project",
                type: "select",
                placeholder: "Project Name...",
                values: this.projects,
                returnValue: true,
                add: true, 
                ...this.props,
                onChange: this.form.onChange,
//                defaultValue: this.selectedProject,
                className
            };

//            autorun(() => {
//                this.state.props.values = this.projects;
//            });
        });
    }
    
    componentWillUnmount() {
        const {group} = this.props;
        window['selectProjectInput' + (group || "")] = null;
        delete window['selectProjectInput' + (group || "")];
    }
    
    onChange(el, val) {
        this.selectedTmpVal = val;
        this.state.selectedVal = val;
        const {onChange, name, group} = this.props;
        onChange && onChange(val, name, this);
        setTimeout(() => {
            const selectSiteInput = window['selectSiteInput' + (group || "")];
            !!selectSiteInput && (selectSiteInput.project = val);
//            this.selectedTmpVal = null;
        }, 200);
    }

    get isConsultant() {
        const {is: {isConsultant}} = storage;
        return isConsultant;
    }

    set client(selectedClient) {
        execWhen(() => this.refs.input).then(ref => {
            const {showAll} = this.props;
            if(showAll) {
                this.state.selectedVal = {value: 'All', label: 'All'};
            } else {
                ref.reset();
            }
            
            if (selectedClient) {
                if(isObject(selectedClient)) {
                    const id = selectedClient.id || selectedClient.value.id;
                    selectedClient = storage.find.findClientById(id);
                    if(selectedClient) {
                        if(this.isConsultant) {
                            this.state.lists.list = selectedClient.data.projects;
                        } else {
                            this.state.lists.list = storage.list.projects;
                        }
                        if(this.state.selectedVal) {
                            if(this.state.lists.list.noneMatch(v => v.id === this.state.selectedVal.id)) {
                                this.state.selectedVal = null;
                            }
                        }
                    } else {
                        //TODO: check why this part run
                        this.state.lists.list = [];
                        this.state.selectedVal = null;
                        console.error('selectedClient is null');
                    }
                } else {
                    this.state.selectedVal = null;
                }
            } else {
                this.state.selectedVal = null;
                this.state.lists.list = [];
            }
        });
    }

    set value(value) {
        this.onChange(null, value);
        console.log(`set value: ${value}`)
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
            return {value: val, label: val === 'All' ? val : (val.name || val.data.name)};
        });
    }

    @computed
    get selectedProject() {
        if (this.selectedTmpVal) {
//            return this.selectedTmpVal;
        }

        const {showAll} = this.props;
        const {selectedVal} = this.state;

//        console.log('selectedProject', selectedVal)
        if (!selectedVal)
            return showAll ? {value: 'All', label: 'All'} : null;
        if (selectedVal.label && selectedVal.value) {
            return selectedVal;
        }
        if (selectedVal === 'All') {
            return {value: selectedVal, label: selectedVal};
        }
        let {name, data} = selectedVal;
        const label = data ? data.name : name;
//        console.log('selectedProject label', {value: selectedVal, label})
        return {value: selectedVal, label};
    }

    render() {
        if(storage.is.isContractor) return null;
        const {props} = this.state;
        if(!props) return null;

        return <ClearableInput {...props} defaultValue={this.selectedProject}/>;
    }
}

export default SelectInput;
