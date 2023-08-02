import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import ANewDialog from 'components/dialogs/ANewDialog';

import {TemplateQuestions} from 'components/templates';

import style from "./NewTemplateDialog.lazy.css";
import insertInspectionsQuestionnaireTemplate
    from "mutations/all/Questionnaires/InspectionsQuestionnaireTemplate/insertInspectionsQuestionnaireTemplate";
import {FormControls, Row} from "components/FormComponents";
import {ClearableInput, SelectAssetInput, SelectAssetTypeInput} from "components/inputs";
import {execWhen} from "utils/UtilsFuns";

//<editor-fold desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewTemplateDialog";
    title = "Create Inspection Template";

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
            if (!form.isValid('asset_type')) {
                infoDialog.open('Asset Type is required');
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
        if (!form.isValid('asset_type')) {
            infoDialog.open('Asset Type is required');
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

        const {visibility, asset_type, asset} = form.data;
        const data = {
            asset_type,
            asset_id: asset && asset.id,
            //
            visibility,
            name,
            desc,
            question_list: {data: question_list},
        };

        btn.text("Saving...").disabled();
        insertInspectionsQuestionnaireTemplate(data).then(res => {
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
        const visibility = item ? item.data.visibility : null;

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
                <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectAssetInput name="asset" placeholder="Asset..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
              rendered
              idx={2}
              title="2. Inspection Questionnaire"
              onFormOpen={onFormOpen}
              onFormBack={onFormBack}
            >
                <TemplateQuestions
                  ref="questions"
                  getDialogDOM={this.getDialogDOM}
                  isLibrary
                  defaultType="Inspections"
                  mainTitle="Inspection Template Questionnaire"
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
