import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';
import {ClearableInput, ProfileField, SelectClientInput} from 'components/inputs';

import {AEditDialog} from 'components/dialogs';
import {FormControls, Row} from "components/FormComponents";
import style from "./EditDialog.lazy.css";
import updateTrainingToolboxTalkSubject
    from "mutations/all/TrainingToolboxTalkSubject/updateTrainingToolboxTalkSubject";
import findByIdTrainingToolboxTalkSubject from "mutations/all/TrainingToolboxTalkSubject/findByIdTrainingToolboxTalkSubject";

@observer
class EditDialog extends AEditDialog {
    pageKey = "ToolboxTalkSubjectDialog";
    className = 'ANewTableFormDialog';
    findById: findByIdTrainingToolboxTalkSubject;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Toolbox Talk Subject";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.form = new Form();
    }
    
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Toolbox Talk Subject Name is required');
            return;
        }
        
        const {name, client} = form.data;
        const data = {};
        
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.checkClient(data, old_data, client);
        
        console.log(data)
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateTrainingToolboxTalkSubject({id: this.item.id, ...data}).then(res => {
            if(!res) {
                return infoDialog.open("The record no longer exist.");
            }
            console.log("res", res)
            onSaved && onSaved(data);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close(); 
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }
    
    @computed get item() {
        return this.props.state.item;
    }
    
    render() {
        if (!this.item) {
            return null;
        }
        
        const {
            props: {dialog: {renderProfileCover}},
             item, item: {
                id, data: {
                    created_at, name 
                }
            }
        } = this;

        const {isConsultant} = storage.is;

        return <FormControls>
            {isConsultant && <Row
                activeAlways
                rendered
                idx={0}
                title="Company"
            >
                <SelectClientInput name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} showAll className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                activeAlways
                rendered
                idx={1}
                title="Toolbox Talk Subject Details"
            >
                <ClearableInput name="name" type="text" placeholder="Toolbox Talk Subject Name" defaultValue={name} className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
