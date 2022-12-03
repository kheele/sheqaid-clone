// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {execWhen} from '../../../../../utils/Utils';

import {ClearableInput} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import {TemplateQuestions} from '../../../../../components/templates';

import style from "./NewLibraryDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewLibraryDialog";
    title = "Create Master Questionnaire";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/contractors/questionnaires/library/";

    @observable
    state = {
        lists: {
            visibility: [
                {text: 'Only My Company', value: 'OnlyMyCompany', checked: false}, 
                {text: 'Every Company', value: 'EveryCompany', checked: false}
            ],
            answered_by: [
                {text: 'Sender', value: 'Sender', checked: false}, 
                {text: 'Receipient', value: 'Receipient', checked: false}
            ]
        }
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
        
        this.onNext = this.onNext.bind(this);
        
        this.getDialogDOM = this.getDialogDOM.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("visibility", this.onChangeVisibility.bind(this));
    }
    // </editor-fold>
    
    onChangeVisibility(el, val) {
        execWhen(() => this.refs.questions).then(questions => {
            questions.onVisibilityChange(val);
        });
    }

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form, refs: {questions}} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('visibility')) {
                infoDialog.open('Please select "Visible To" option');
                return;
            }
            if (!form.isValid('answered_by')) {
                infoDialog.open('Please select "Needs Answers From" option');
                return;
            }
        }
        if(idx === 2) {
            if (!questions.isValidForm()) {
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, refs: {questions}} = this;

        if (!form.isValid('visibility')) {
            infoDialog.open('Please select "Visible To" option');
            return;
        }
        if (!form.isValid('answered_by')) {
            infoDialog.open('Please select "Needs Answers From" option');
            return;
        }
        
        if (!questions.isValidForm()) {
            return;
        }

        progressDialog.open('Please wait...');
        const qForm = await questions.getForm();
        
        const {visibility, answered_by} = form.data;
        const data = {visibility, form: {...qForm, answered_by}};
        
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
    // </editor-fold>
    
    getDialogDOM() {
        const {props: {dialog}} = this;
        return dialog.getDOMNode();
    }
    
    get defaultTitlePageQuestions() {
        return [{questionText: "Completed By", questionType: "Short Answer"}];
    }
    
    get loggedContractor() {
        return storage.loggedContractor;
    }

    get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {
            item, props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        const visibility = item ? item.data.visibility : null;
        const answered_by = item ? item.data.form.answered_by : 'Receipient';
        const form = item ? item.data.form : null;
        
        return <FormControls>
            <Row 
                rendered  
                active
                idx={1}
                title="1. Basic Info" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="visibility" type="radio" placeholder="Visible To" defaultValue={visibility} required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.visibility} returnValue/>
                <ClearableInput name="answered_by" type="radio" placeholder="Needs Answers From" defaultValue={answered_by} required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.answered_by} returnValue/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Questionnaire" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <TemplateQuestions 
                    ref="questions" 
                    getDialogDOM={this.getDialogDOM} 
                    isLibrary
                    defaultType="Questions"
                    mainTitle="Contractor Master Questionnaire"
                    defaultDocTitle="Untitled Questionnaire"
                    defaultTitlePageQuestions={this.defaultTitlePageQuestions} 
                    item={this.item} 
                    formData={form}
                />
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewDialog;
