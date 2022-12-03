import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from '../../../utils/Form';
import {SelectClientInput, SelectProjectInput, SelectSiteInput} from '../../../components/inputs';

//import style from "./SelectSiteConfirmInputs.lazy.css";

@observer
class SelectSiteConfirmInputs extends React.Component {
    
    @observable
    state = {
    };

    constructor(props) {
        super(props);
        
        this.form = new Form();
        this.form.addChangeOne("client", this.onChangeClient.bind(this));
        this.form.addChangeOne("project", this.onChangeProject.bind(this));
        this.form.addChangeOne("site", this.onChangeSite.bind(this));
    }
    
    onChangeClient(el, val) {
        const {form, props: {onChange, name}} = this;
        if(onChange) {
            onChange({client: val, project: form.get('project'), site: form.get('site')}, name, this);
        }
    }
    
    onChangeProject(el, val) {
        const {form, props: {onChange, name}} = this;
        if(onChange) {
            onChange({client: form.get('client'), project: val, site: form.get('site')}, name, this);
        }
    }
    
    onChangeSite(el, val) {
        const {form, props: {onChange, name}} = this;
        if(onChange) {
            onChange({client: form.get('client'), project: form.get('project'), site: val}, name, this);
        }
    }
    
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        if (!form.isValid('project')) {
            infoDialog.open('Project is required');
            return;
        }
        if (!form.isValid('site')) {
            infoDialog.open('Site is required');
            return;
        }
        
        const {site, project, client} = form.data;
        const data = {};
        if(client) {
            if(client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
            } else {
                data.client = client;
            }
        }
        if(project) {
            if(project.id) {
                const {id, data: _data, name} = project;
                data.project = {id, name: name || _data.name};
            } else {
                data.project = project;
            }
        }
        if(site) {
            if(site.id) {
                const {id, data: _data, name} = site;
                data.site = {id, name: name || _data.name};
            } else {
                data.site = site;
            }
        }
    }
  
    @computed get selectedClient() {
        const {item} = this;
        if(item) {
            const {id, data: {client, project, site}} = item;

            if(client === 'All') {
                return {value: client, label: client};
            }
            if(client) {
                return {value: client, label: client.name || client.data.name};
            }
        }
        
        const {selectedClient} = storage.selected;
        if(!selectedClient) return null;
        console.log('selectedClient', selectedClient)
        if(selectedClient === 'All') {
            return {value: selectedClient, label: selectedClient};
        }
        return {value: selectedClient, label: selectedClient.name || selectedClient.data.name};
    }
    
    @computed get selectedProject() {
        const {item} = this;
        if(item) {
            const {id, data: {client, project, site}} = item;

            if(project === 'All') {
                return {value: project, label: project};
            }
            if(project) {
                return {value: project, label: project.name || project.data.name};
            }
        }
        
        const {selectedProject} = storage.selected;
        if(!selectedProject) return null;
        if(selectedProject === 'All') {
            return {value: selectedProject, label: selectedProject};
        }
        return {value: selectedProject, label: selectedProject.name || selectedProject.data.name};
    }
    
    @computed get selectedSite() {
        const {item} = this;
        if(item) {
            const {id, data: {client, project, site}} = item;

            if(site === 'All') {
                return {value: site, label: site};
            }
            if(site) {
                return {value: site, label: site.name || site.data.name};
            }
        }
        
        const {selectedSite} = storage.selected;
        if(!selectedSite) return null;
        if(selectedSite === 'All') {
            return {value: selectedSite, label: selectedSite};
        }
        return {value: selectedSite, label: selectedSite.name || selectedSite.data.name};
    }
    
    get item() {
        return this.props.item;
    }
    
    render() {
        const {isConsultant} = storage.is;
        const {title} = this.props;
        return (<div className="controls SelectSiteConfirmInputs" style={{height: "auto", marginBottom: -15}}>
                {title && <label>{title}</label>}
                <div className="row flex">
                    {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={this.selectedClient} required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                    <SelectProjectInput name="project" placeholder="Project..." defaultValue={this.selectedProject} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." defaultValue={this.selectedSite} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </div>
        </div>);
    }
}

export default SelectSiteConfirmInputs;
