// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import SelectEmployeesDialog from 'components/templates/SelectEmployeesDialog';
import {AEditDialog} from 'components/dialogs';

import {TemplateQuestions} from 'components/templates';

import style from "./EditQuestionnaireDialog.lazy.css";
import updateContractorsQuestionnaire
    from "mutations/all/Questionnaires/ContractorsQuestionnaires/updateContractorsQuestionnaire";
import {ShouldUpdate} from "utils/Utils";
import findByIdContractorsQuestionnaire
    from "mutations/all/Questionnaires/ContractorsQuestionnaires/findByIdContractorsQuestionnaire";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditQuestionnaireDialog extends AEditDialog {
    pageKey = "EditQuestionnaireDialog";
    findById = findByIdContractorsQuestionnaire;
    removeById = updateContractorsQuestionnaire;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Questionnaire";
    }
    
    get removeById() {
        const {item} = this.state;
        if (!item) return null;
        const {data: {status}} = item;
        
        const {isContractor} = storage.is;
        
        if (!isContractor && status !== "CompleteAccepted") {
            return updateContractorsQuestionnaire;
        }
    }
    
    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/contractors/questionnaires/";

    @observable
    state = {
        lists: {
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
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 2) {
            if (!form.isValid('answered_by')) {
                infoDialog.open('Please select "Needs Answers From" option');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, refs: {questions: questionsRef}, item: {data: old_data}} = this;

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

        const {answered_by} = form.data;
        const data = {
            // is_template: false,
            // name,
            // desc,
            // answered_by,
            question_list: {data: question_list},
        };

        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, desc, 'desc');
        ShouldUpdate.check(data, old_data, answered_by, 'answered_by');
        ShouldUpdate.checkListToJS(data, old_data, question_list, 'question_list');

        console.log(data)

        btn.text("Saving...").disabled();
        updateContractorsQuestionnaire({id: this.item.id, ...data}).then(res => {
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
                    contractor: {name: contractorName, username},
                }
            }
        } = this;
        
        console.log(this.item)
        return <FormControls>
            <Row 
                rendered  
                activeAlways
                idx={1}
                title="1. Contractor Details" 
                onFormOpen={onFormOpen} 
            >
                <ProfileField name="contractor" value={contractorName} placeholder="Contractor" className="col-lg-6"/>
                <ProfileField name="email" value={username} placeholder="Email Address" className="col-lg-6"/>
            </Row>
            <Row 
                rendered 
                active
                idx={2}
                title="2. Who Should Answer Questionnaire" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="answered_by" type="radio" placeholder="Needs Answers From" defaultValue={answered_by} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.answered_by} returnValue/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Contractor Questionnaire" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <TemplateQuestions 
                    ref="questions" 
                    getDialogDOM={this.getDialogDOM} 
                    defaultType="Questions"
                    mainTitle="Contractor Questionnaire"
                    defaultDocTitle="Untitled"
                    defaultTitlePageQuestions={this.defaultTitlePageQuestions} 
                    item={this.item}
                    SelectEmployeesDialog={SelectEmployeesDialog}
                />
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditQuestionnaireDialog;
