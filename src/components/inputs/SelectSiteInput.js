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
            const {selected, list: {sites = []}} = storage;
            const {user: {data: {site: my_site}}} = storage.loggedUser;
            if(my_site && selected.selectedSite && (my_site.id === selected.selectedSite.id)) {
                this.state.selectedVal = selected.selectedSite;
                return;
            }
            
            let selectedSite = site ? sites[parseInt(site)] : null;
            if (selectedSite) {
                this.state.selectedVal = selectedSite;
                return;
            }
            
            if(showAll) {
                return;
            }
            
            if(selected.selectedSite) {
                this.state.selectedVal = selected.selectedSite;
            }
        }
    }
    
    componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectSiteInput`;
        
//        execWhen(() => this.state.lists.list.length).then(() => {
        autorun(() => {
            this.state.props = {
                ref: "input",
                key: new Date().getTime(),
                name: "site",
                type: "select",
                placeholder: "Site Name...",
                values: this.sites,
                returnValue: true,
                add: true, 
                ...this.props, 
                onChange: this.form.onChange,
//                defaultValue: this.selectedSite,
                className
            };
        });
    }    

    componentWillUnmount() {
        const {group} = this.props;
        window['selectSiteInput' + (group || "")] = null;
        delete window['selectSiteInput' + (group || "")];
    }
    
    onChange(el, val) {
        this.selectedTmpVal = val;
        this.state.selectedVal = val;
        const {onChange, name} = this.props;
        onChange && onChange(val, name, this);
//        setTimeout(() => {
//            this.selectedTmpVal = null;
//        }, 0);
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
                if (isObject(selectedClient)) {
                    const id = selectedClient.id || selectedClient.value.id;
                    selectedClient = storage.find.findClientById(id);
                    if(selectedClient) {
                        this.state.lists.list = selectedClient.data.sites || [];

                        if(this.state.selectedVal) {
                            if(this.state.lists.list.noneMatch(v => v.id === this.state.selectedVal.id)) {
                                this.state.selectedVal = null;
                            }
                        }
                    } else {
                        //TODO: check why this part run
                        this.state.selectedVal = null;
                        this.state.lists.list = [];
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

    set project(selectedProject) {
        execWhen(() => this.refs.input).then(ref => {
            const {showAll} = this.props;
            if(showAll) {
                this.state.selectedVal = {value: 'All', label: 'All'};
            } else {
                ref.reset();
            }
            
            if (selectedProject) {
                if (isObject(selectedProject)) {
                    const id = selectedProject.id || selectedProject.value.id;
                    selectedProject = storage.find.findProjectById(id);
                    if(selectedProject) {
                        this.state.lists.list = selectedProject.data.sites || [];

                        if(this.state.selectedVal) {
                            if(this.state.lists.list.noneMatch(v => v.id === this.state.selectedVal.id)) {
                                this.state.selectedVal = null;
                            }
                        }
                    } else {
                        //TODO: check why this part run
                        this.state.lists.list = [];
                        this.state.selectedVal = null;
                        console.error('selectedProject is null');
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
    get sites() {
        const {showAll, isBlacklisting} = this.props;
        const all = [];
        if (showAll) {
            all.push('All');
        }
        const {is: {isContractor}, loggedContractor} = storage;
        if(isContractor) {
            const {id, data: {name, username, site_list = []}} = loggedContractor;
            return [...all, ...site_list].map(val => {
                return {value: val, label: val === 'All' ? val : (val.name || val.data.name)};
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
            return {value: val, label: val === 'All' ? val : (val.name || val.data.name)};
        });
    }

    @computed
    get selectedSite() {
        if (this.selectedTmpVal) {
//            return this.selectedTmpVal;
        }

        const {showAll} = this.props;
        const {selectedVal} = this.state;

//        console.log('selectedSite', selectedVal)
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
//        console.log('selectedSite label', {value: selectedVal, label})
        return {value: selectedVal, label};
    }

    render() {
        const {props} = this.state;
        if(!props) return null;

        return <ClearableInput {...props} defaultValue={this.selectedSite}/>;
    }
}

export default SelectInput;
