import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../utils/Form';
import {ClearableInput, SelectClientInput, SelectProjectInput} from '../../../components/inputs';

import {AEditDialog} from '../../../components/dialogs';
import style from "./EditDialog.lazy.css";

@observer
class EditDialog extends AEditDialog {
    pageKey = "Site";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Site";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/sites/";
    @observable
    state = {
    };

    constructor(props) {
        super(props);
        
        this.form = new Form();
    }
    
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Site Name is required');
            return;
        }
        
        const {name, address, project, client} = form.data;
        const data = {name};
        if(address) {
            data.address = address;
        }
        if(project) {
            if(project.id) {
                data.project = {id: project.id, name: project.name || project.data.name};
            } else {
                data.project = project;
            }
        } 
        if(client) {
            if(client.id) {
                data.client = {id: client.id, name: client.name || client.data.name};
            } else {
                data.client = client;
            }
        }
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            storage.update.updateSite(this.item.id, data);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close(); 
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
  
    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
             item, item: {
                id, data: {
                    created_at, name, address, project, client, employees
                }
            }
        } = this;
        
        console.log(this.item)
        
        const {isConsultant} = storage.is;
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="name" type="text" placeholder="Site Name" defaultValue={name} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <ClearableInput name="address" type="textarea" placeholder="Site Address" defaultValue={address} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </div>
                {isConsultant && <div className="row">
                    <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </div>}
                <div className="row">
                    <SelectProjectInput name="project" placeholder="Project..." defaultValue={RenderUtils.selectedProject.call(this)} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>);
    }
}

export default EditDialog;
