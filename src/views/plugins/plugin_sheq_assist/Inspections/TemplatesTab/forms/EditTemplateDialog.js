import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import AEditDialog from 'components/dialogs/AEditDialog';

import {TemplateQuestions} from 'components/templates';

import style from "./EditTemplateDialog.lazy.css";
import {execWhen} from "utils/UtilsFuns";
import {ShouldUpdate} from "utils/Utils";
import updateInspectionsQuestionnaireTemplate
    from "mutations/all/Questionnaires/InspectionsQuestionnaireTemplate/updateInspectionsQuestionnaireTemplate";
import {FormControls, Row} from "components/FormComponents";
import {ClearableInput, SelectAssetInput, SelectAssetTypeInput} from "components/inputs";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditTemplateDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Inspection Template Questionnaire";
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
        const {form, refs: {questions: questionsRef}, item: {data: old_data}} = this;

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
            visibility,
            is_template: true,
            // name,
            // desc,
            question_list: {data: question_list},
        };

        ShouldUpdate.check(data, old_data, asset_type, 'asset_type');
        ShouldUpdate.checkAsset(data, old_data, asset, 'asset');
        //
        ShouldUpdate.check(data, old_data, visibility, 'visibility');
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, desc, 'desc');
        ShouldUpdate.checkListToJS(data, old_data, question_list, 'question_list');

        console.log(data)

        btn.text("Saving...").disabled();
        updateInspectionsQuestionnaireTemplate({id: this.item.id, ...data}).then(res => {
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
    //</editor-fold>
    
    getDialogDOM() {
        const {props: {dialog}} = this;
        return dialog.getDOMNode();
    }

    get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="render">
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
                    answered_by = 'Sender',
                    is_template,
                    visibility,
                    page_title_list,
                    question_list,
                    //
                    asset_type,
                    asset,
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
                <ClearableInput name="visibility" type="radio" placeholder="Visibility" defaultValue={visibility} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.visibility} returnValue/>
                <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." defaultValue={asset_type} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectAssetInput name="asset" placeholder="Asset..." defaultValue={asset} className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                  isEditting
                  defaultType="Inspections"
                  mainTitle="Inspection Template Questionnaire"
                  defaultDocTitle="Untitled Questionnaire"
                  item={this.item}
                />
            </Row>
        </FormControls>;
    }
    //</editor-fold>
}

export default EditDialog;
