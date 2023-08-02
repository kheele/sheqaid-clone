// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import SelectEmployeesDialog from 'components/templates/SelectEmployeesDialog';
import ANewDialog from 'components/dialogs/ANewDialog';

import {TemplateQuestions} from 'components/templates';

import style from "./NewQuestionnaireDialog.lazy.css";
import insertContractorsQuestionnaire
    from "mutations/all/Questionnaires/ContractorsQuestionnaires/insertContractorsQuestionnaire";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewQuestionnaireDialog extends ANewDialog {
    pageKey = "NewQuestionnaireDialog";
    title = "Create Questionnaire";

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
        const {form, refs: {questions: questionsRef}} = this;

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

        const {id: contractor_id} = this.loggedContractor;
        
        const {answered_by} = form.data;
        const data = {
            name,
            desc,
            answered_by,
            question_list: {data: question_list},
            contractor_id,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        insertContractorsQuestionnaire(data).then(res => {
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
        const {item, props: {onFormNext, onFormBack, onFormOpen}} = this;

        const answered_by = item ? item.data.answered_by : 'Recipient';
        const {data: {name: contractorName, username}} = this.loggedContractor;

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

export default NewQuestionnaireDialog;
