import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import {TemplateQuestions} from '../../../../../components/templates';

import style from "./NewTemplateDialog.lazy.css";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewTemplateDialog";
    title = "Create Template";

    constructor(props) {
        super(props, style);
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
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
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
        const {item} = this;
        const form = item ? item.data.form : null;
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

export default NewDialog;
