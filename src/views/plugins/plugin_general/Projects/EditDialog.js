import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';
import {ClearableInput, SelectClientInput} from '../../../../components/inputs';
import {FormControls, Row} from '../../../../components/FormComponents';

import {AEditDialog} from '../../../../components/dialogs';
import style from "./EditDialog.lazy.css";

@observer
class EditDialog extends AEditDialog {
    pageKey = "Project";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Project";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/projects/";
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
            infoDialog.open('Project Name is required');
            return;
        }
        
        const {name, address, client} = form.data;
        const data = {};
        if(name) {
            data.name = name;
        }
        if(address) {
            data.address = address;
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
            storage.update.updateProject(this.item.id, data);
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
                    created_at, name, address, client, sites
                }
            }
        } = this;
        
        console.log(this.item)
        
        const {isConsultant} = storage.is;
        return <FormControls onChange={this.form.onChange}>
            <Row 
                rendered  
                activeAlways
                idx={1}
                title="Project Details" >
                    <ClearableInput name="name" type="text" placeholder="Project Name" defaultValue={name} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="address" type="textarea" placeholder="Project Address" defaultValue={address} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    {isConsultant && <SelectClientInput name="client" placeholder="Company..." required defaultValue={RenderUtils.selectedClient.call(this)} className="col-lg-12 form-control" onChange={this.form.onChange}/>}
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
