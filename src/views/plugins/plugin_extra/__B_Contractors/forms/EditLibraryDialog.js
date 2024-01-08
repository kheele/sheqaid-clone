// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {execWhen, ShouldUpdate} from 'utils/Utils';

import {ClearableInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import {TemplateQuestions} from 'components/templates';

import style from "./EditLibraryDialog.lazy.css";
import updateContractorsQuestionnaire
    from "mutations/all/Questionnaires/ContractorsQuestionnaires/updateContractorsQuestionnaire";
import updateContractorsQuestionnaireLibrary
    from "mutations/all/Questionnaires/ContractorsQuestionnaireLibrary/updateContractorsQuestionnaireLibrary";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditLibraryDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Master Questionnaire";
    }

    get topButtonsHiddenDelete() {
        return true;
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
                {text: 'Private', value: 'Private', checked: false},
                {text: 'Public', value: 'Public', checked: false}
            ],
            answered_by: [
                {text: 'Sender', value: 'Sender', checked: false}, 
                {text: 'Recipient', value: 'Recipient', checked: false}
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
        execWhen(() => this.refs.questions).then(ref => {
            ref.onVisibilityChange(val);
        });
    }
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form, refs: {questions}} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('visibility')) {
                infoDialog.open('Please select "Visibility" option');
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
        const {form, refs: {questions: questionsRef}, item: {data: old_data}} = this;

        if (!form.isValid('visibility')) {
            infoDialog.open('Please select "Visibility" option');
            return;
        }
        if (!form.isValid('answered_by')) {
            infoDialog.open('Please select "Needs Answers From" option');
            return;
        }
        
        if (!questionsRef.isValidForm()) {
            return;
        }

        progressDialog.open('Please wait...');
        const qForm = await questionsRef.getForm();
        let {
            name,
            desc,
            type,
            title_page_list,
            question_list,
        } = qForm;

        question_list = [
            ...title_page_list.map(v => ({is_page_title: true, ...v})),
            ...question_list.map(v => ({is_page_title: false, ...v})),
        ];

        // const data = {form: {...qForm, answered_by}};
        const {visibility, answered_by} = form.data;
        const data = {
            // visibility,
            is_template: true,
            // name,
            // desc,
            // answered_by,
            question_list: {data: question_list},
        };
        
        ShouldUpdate.check(data, old_data, visibility, 'visibility');
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, desc, 'desc');
        ShouldUpdate.check(data, old_data, answered_by, 'answered_by');
        ShouldUpdate.checkListToJS(data, old_data, question_list, 'question_list');
        
        console.log(data)

        btn.text("Saving...").disabled();
        updateContractorsQuestionnaireLibrary({id: this.item.id, ...data}).then(res => {
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
    // </editor-fold>
    
    getDialogDOM() {
        const {props: {dialog}} = this;
        return dialog.getDOMNode();
    }
    
    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog, dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    name,
                    desc,
                    status,
                    status_answered_by_sender,
                    answered_by = 'Recipient',
                    is_template,
                    visibility,
                    page_title_list,
                    question_list,
                }
            }
        } = this;
        
        console.log(this.item)
        
        return <FormControls>
            <Row 
                rendered  
                active
                idx={1}
                title="1. Basic Info" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="visibility" type="radio" placeholder="Visibility" defaultValue={visibility} required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.visibility} returnValue/>
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
                    isEditting
                    defaultType="Questions"
                    mainTitle="Contracts Master Questionnaire"
                    defaultDocTitle="Untitled Questionnaire"
                    item={this.item}
                />
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditDialog;
