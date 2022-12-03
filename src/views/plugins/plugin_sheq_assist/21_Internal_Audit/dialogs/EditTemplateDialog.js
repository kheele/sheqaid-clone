import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import AEditDialog from '../../../../../components/dialogs/AEditDialog';

import {TemplateQuestions} from '../../../../../components/templates';

import style from "./EditTemplateDialog.lazy.css";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditTemplateDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Template";
    }
    
    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/21_Internal_Audit/forms/";

    @observable
    state = {
    };

    constructor() {
        super();
        
        this.getDialogDOM = this.getDialogDOM.bind(this);
        
        this.form = new Form();
    }

    async onSubmit(e, btn, onSaved) {
        const {form, refs: {questions}} = this;

        if (!questions.isValidForm()) {
            return;
        }

        progressDialog.open('Please wait...');
        const qForm = await questions.getForm();
        
        const data = {form: qForm};
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            progressDialog.close();
            btn.text("Save").enabled();
        });
    }
    
    getDialogDOM() {
        const {props: {dialog}} = this;
        return dialog.getDOMNode();
    }
    
    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog, dialog: {renderProfileCover}},
             item, item: {
                id, data: {
                    created_at, client_id, company_id, form, user_id
                }
            }
        } = this;
        
        console.log(this.item)
        return (<div className="controls-wrapper">
            <div className="controls">
                <TemplateQuestions 
                    ref="questions" 
                    getDialogDOM={this.getDialogDOM} 
                    item={this.item} 
                    formData={form}
                />
            </div>
        </div>);
    }
}

export default EditDialog;
