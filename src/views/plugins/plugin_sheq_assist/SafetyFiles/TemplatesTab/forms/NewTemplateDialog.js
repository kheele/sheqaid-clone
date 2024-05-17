import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import ANewDialog from 'components/dialogs/ANewDialog';

import {TemplateQuestions} from 'components/templates';

import style from "./NewTemplateDialog.lazy.css";
import insertSafetyFilesQuestionnaireTemplate
	from "mutations/all/Questionnaires/SafetyFilesQuestionnaireTemplate/insertSafetyFilesQuestionnaireTemplate";
import {FormControls, Row} from "components/FormComponents";
import {ClearableInput} from "components/inputs";
import {execWhen} from "utils/UtilsFuns";
import findByIdSafetyFilesQuestionnaireTemplate
	from "mutations/all/Questionnaires/SafetyFilesQuestionnaireTemplate/findByIdSafetyFilesQuestionnaireTemplate";

//<editor-fold desc="Dialog">
@observer
class NewDialog extends ANewDialog {
	pageKey = "NewTemplateDialog";
	title = "Create Safety File Template";
	
	findById = findByIdSafetyFilesQuestionnaireTemplate;
	
	constructor(props) {
		super(props, style);
	}
	
	// get findById() {
	// 	// if(!this.isOpen) return updateSafetyFilesQuestionnaireTemplate;
	//
	// 	if (!this.state.item) return;
	// 	return findByIdSafetyFilesQuestionnaireTemplate;
	// }
	
	get controls() {
		return Controls;
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
            answered_by: [
                {text: 'Sender', value: 'Sender', checked: false}, 
                {text: 'Recipient', value: 'Recipient', checked: false}
            ]
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
		if (idx === 1) {
			if (!form.isValid('visibility')) {
				infoDialog.open('Please select "Visibility" option');
				return;
			}
            if (!form.isValid('answered_by')) {
                infoDialog.open('Please select "Needs Answers From" option');
                return;
            }
		}
		if (idx === 2) {
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
		
		const {visibility, answered_by} = form.data;
		const data = {
			visibility,
			name,
			desc,
			answered_by,
			question_list: {data: question_list},
		};
		
		btn.text("Saving...").disabled();
		insertSafetyFilesQuestionnaireTemplate(data).then(res => {
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
	
	@computed
	get itemToView() {
		return this.props.state.itemToView;
	}
	
	@computed
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
        const answered_by = item ? item.data.answered_by : 'Recipient';
		
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
				title="2. Safety File Questionnaire"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<TemplateQuestions
					ref="questions"
					getDialogDOM={this.getDialogDOM}
					isLibrary
					defaultType="Safety Files"
					mainTitle="Safety File Template Questionnaire"
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
