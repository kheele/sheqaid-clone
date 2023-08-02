import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from '../../../../utils/Form';
import {Button, SelectClientInput, SelectProjectInput, SelectSiteInput} from '../../../../components/inputs';

import {ANewDialog} from '../../../../components/dialogs';
import style from "./SelectSiteConfirmDialog.lazy.css";

@observer
class SelectSiteConfirmDialog extends ANewDialog {
    pageKey = "SelectSiteConfirmDialog";
    title;

    constructor(props) {
        super(props, style);
        
        const {isConsultant} = storage.is;
        this.title = "Select " + (isConsultant ? "Client/Company, " : "") + "Project or Site";
    }

    componentDidMount() {
        const {selectedSite} = storage.selected;
        if(selectedSite) return;
        
        super.componentDidMount();
    }

    get controls() {
        return Controls;
    }

    onCancel(e, btn) {
        confirmDialog.open(<React.Fragment>
            <p>Cancelling this form will exit the whole process.</p>
            <p><b>Do you want to exit the process?</b></p>
        </React.Fragment>).then(res => {
            if(res === 1) {
                this.close();
                this.props.attachedControl.props.dialog.close();
            }
        });
    }

    @computed get topButtons() {
        return <React.Fragment>
            <Button ref={ref => this.refs.cancel = ref} className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button ref={ref => this.refs.submit = ref} className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </React.Fragment>;
    }
}

@observer
class Controls extends React.Component {
    
    @observable
    state = {
    };

    constructor(props) {
        super(props);
        
        this.form = new Form();
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
        
        console.log(data)
                
        const actions = [];
        
        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        if(!selectedClient || selectedClient.id !== client.id) {
            actions.push(storage.login.loginClient(client.id));
        }
        if(!selectedProject || selectedProject.id !== project.id) {
            actions.push(storage.login.loginProject(project.id));
        }
        if(!selectedSite || selectedSite.id !== site.id) {
            actions.push(storage.login.loginSite(site.id));
        }
        
        if(actions.isEmpty()) {
            this.props.close();
        } else {
            btn.text("Wait...").disabled();
            Promise.all(actions).then(() => {
    //            selectedItems.refs.clients.select(item);

    //            console.log("res", res)
                const {name, onChange} = this.props.dialog.props;
                onChange && onChange(data, name, this);
                this.props.close();
            }).finally(() => {
                btn.text("Done").enabled();
            });
        }
    }
  
    get item() {
        return this.props.state.item;
    }
    
    render() {
        const {isConsultant} = storage.is;
        return (<div className="controls-wrapper">
            <div className="controls">
                <h4 className="text-center margin-b-20">Please select the details below before you proceed</h4>
                {isConsultant && <div className="row">
                    <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </div>}
                <div className="row">
                    <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <SelectSiteInput name="site" placeholder="Site..." defaultValue={RenderUtils.selectedSite.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </div>
                <p className="text-center margin-t-20">Note: You will not continue with the process without filling the above information</p>
            </div>
        </div>);
    }
}

export default SelectSiteConfirmDialog;
