import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {ShouldUpdate} from '../../../../../utils/Utils';
import {ClearableInput, ProfileField, SelectClientInput} from '../../../../../components/inputs';

import {AEditDialog} from '../../../../../components/dialogs';
import style from "./EditDocumentCategoryDialog.lazy.css";
import {FormControls, Row} from "../../../../../components/FormComponents";

@observer
class EditDialog extends AEditDialog {
    pageKey = "DocumentCategoryDialog";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Document Category";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/document-categories/';
    @observable
    state = {
    };

    constructor(props) {
        super(props);
        
        this.form = new Form();
    }
    
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Document Category Name is required');
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
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
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
                title="Document Category Details"
            >
                <ClearableInput name="name" type="text" placeholder="Document Category Name" defaultValue={name} className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
