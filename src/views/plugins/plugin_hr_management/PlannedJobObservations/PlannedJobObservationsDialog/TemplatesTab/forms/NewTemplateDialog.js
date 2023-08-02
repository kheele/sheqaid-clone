import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import ANewDialog from 'components/dialogs/ANewDialog';

import {TemplateQuestions} from 'components/templates';

import style from "./NewTemplateDialog.lazy.css";
import insertJobObservationsQuestionnaireTemplate
    from "mutations/all/Questionnaires/JobObservationsQuestionnaireTemplate/insertJobObservationsQuestionnaireTemplate";
import {FormControls, Row} from "components/FormComponents";
import {ClearableInput, SelectAssetInput, SelectAssetTypeInput, SelectJobPositionInput} from "components/inputs";
import {execWhen} from "utils/UtilsFuns";

//<editor-fold desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewTemplateDialog";
    title = "Create Job Observation Template";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
//</editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/21_Internal_Audit/forms/";

    @observable
    state = {
        lists: {
            visibility: [
                {text: 'Private', value: 'Private', checked: false},
                {text: 'Public', value: 'Public', checked: false}
            ],
        }
    };

    //<editor-fold desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.getDialogDOM = this.getDialogDOM.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("visibility", this.onChangeVisibility.bind(this));
    }
    //</editor-fold>

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
            if (!form.isValid('job_position')) {
                infoDialog.open('Job Position is required');
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

    //<editor-fold desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, refs: {questions: questionsRef}} = this;

        if (!form.isValid('visibility')) {
            infoDialog.open('Please select "Visibility" option');
            return;
        }
        if (!form.isValid('job_position')) {
            infoDialog.open('Job Position is required');
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

        const {visibility, job_position} = form.data;
        const data = {
            job_position_id: job_position && job_position.id,
            //
            visibility,
            name,
            desc,
            question_list: {data: question_list},
        };

        btn.text("Saving...").disabled();
        insertJobObservationsQuestionnaireTemplate(data).then(res => {
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
    //</editor-fold>
    
    getDialogDOM() {
        const {props: {dialog}} = this;
        return dialog.getDOMNode();
    }

    get defaultTitlePageQuestions() {
        return [{questionText: "Completed By", questionType: "Short Answer"}];
    }

    get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="render">
    render() {
        const {
            item, props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;

        const data = item ? item.data : {};
        const {visibility, job_position} = data;

        return <FormControls>
            <Row
              rendered
              active
              idx={1}
              title="1. Basic Info"
              onFormOpen={onFormOpen}
              onFormNext={onFormNext}
            >
                <ClearableInput name="visibility" type="radio" placeholder="Visibility" defaultValue={visibility} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.visibility} returnValue/>
                <SelectJobPositionInput
                  ref="job_position"
                  name="job_position" placeholder="Job Position..."
                  defaultValue={job_position}
                  className="col-lg-12 form-control"
                  onChange={this.form.onChange}
                />
            </Row>
            <Row
              rendered
              idx={2}
              title="2. Job Observation Questionnaire"
              onFormOpen={onFormOpen}
              onFormBack={onFormBack}
            >
                <TemplateQuestions
                  ref="questions"
                  getDialogDOM={this.getDialogDOM}
                  isLibrary
                  defaultType="Job Observations"
                  mainTitle="Job Observation Template Questionnaire"
                  defaultDocTitle="Untitled Questionnaire"
                  defaultTitlePageQuestions={this.defaultTitlePageQuestions}
                  item={this.item}
                />
            </Row>
        </FormControls>;
    }
    //</editor-fold>
}

export default NewDialog;
