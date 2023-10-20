// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {isObservableArray, observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {
	ClearableInput,
	Clickable, ProfileField, RowOrgs,
	SelectAssetInput, SelectAssetTypeInput,
	SelectClientInput,
	SelectEmployeeInput,
	SelectQuestionnaireTemplateInput,
	SelectProjectInput,
	SelectSiteInput
} from 'components/inputs';
import SelectEmployeesDialog from 'components/templates/SelectEmployeesDialog';
import {FormControls, NavButtons, Row} from 'components/FormComponents';
import ANewDialog from 'components/dialogs/ANewDialog';

import {AnswerQuestions} from 'components/checkables';

import style from "./NewCheckableDialog.lazy.css";
import insertInspectionsQuestionnaire
	from "mutations/all/Questionnaires/InspectionsQuestionnaires/insertInspectionsQuestionnaire";
import {TemplateQuestions} from "components/templates";
import NewTemplateDialog from "../../TemplatesTab/forms/NewTemplateDialog";
import EditTemplateDialog from "../../TemplatesTab/forms/EditTemplateDialog";
import ProfilePDFReader from "../printers/ProfileResponsePDFReader";
import MKBox from "components/MK/MKBox";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewCheckableDialog extends ANewDialog {
	pageKey = "NewCheckableDialog";

	constructor(props) {
		super(props, style);
	}

	get title() {
		return "Inspection";
	}

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {

	@observable
	state = {
		selectedTemplate: null
	};

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.state.selectedTemplate = this.item;

		this.onChangeAnswer = this.onChangeAnswer.bind(this);

		this.form = new Form();
		this.form.addChangeOne("template", this.onChangeTemplate.bind(this));
	}

	// </editor-fold>

	onChangeTemplate(el, val) {
		this.state.selectedTemplate = val;
	}

	// <editor-fold defaultstate="collapsed" desc="onChangeAnswer">
	onChangeAnswer(parentId, ques, idx) {
		return new Promise((resolve, reject) => {
			const {item} = this;
			if (!item) {
				resolve();
				return;
			}
			if (this.toOnChangeAnswer) {
				resolve();
			} else {
				this.toOnChangeAnswer = setTimeout(() => {
					clearTimeout(this.toOnChangeAnswer);
					this.toOnChangeAnswer = null;
					ques = toJS(ques);

					if (!questionHasChat(ques)) {
						ques.message_list = [];
					}

					console.log('ques', ques.message_list)
					//        btn.text("Saving...").disabled();
//                    neonBinding.events.emit(this.path + "answer/ques", item.id, {parentId, ques, idx}).then(res => {            
//                        resolve(res);
//                    }).catch(reject);
				}, 2000);
			}
		});
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	async onSubmit(e, btn, onSaved) {
		const {form, refs: {questions: questionsRef}} = this;

		if (!form.isValid('template')) {
			infoDialog.open('Template is required');
			return;
		}
		if (!form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}
		if (!form.isValid('project')) {
			infoDialog.open('Project is required');
			return;
		}
		if (!form.isValid('site')) {
			infoDialog.open('Site is required');
			return;
		}

		if (!questionsRef.isValidForm()) {
			return;
		}

		progressDialog.open('Please wait...');
		const template = await questionsRef.getForm();
		let {
			name,
			desc,
			type,
			title_page_list,
			question_list,
		} = template;

		question_list = [
			...title_page_list.map(v => ({is_page_title: true, ...v})),
			...question_list.map(v => ({is_page_title: false, ...v})),
		];

		const {client, project, site} = form.data;
		const data = {
			//
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			//
			name,
			desc,
			question_list: {data: question_list},
		};

		console.log(data)

		btn.text("Saving...").disabled();
		insertInspectionsQuestionnaire(data).then(res => {
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

	get item() {//template
		return this.props.state.item;
	}

	get selectedTemplateDefault() {
		const {selectedTemplate: value} = this.state;
		if (value) {
			const {data: {name: label}} = value;
			return {label, value};
		}
		return null;
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {selectedTemplate} = this.state;
		console.log('template', selectedTemplate)

		let {
			props: {
				onFormNext, onFormBack, onFormOpen,
				dialog: {props: {type}}
			},
			item
		} = this;

		return <FormControls>
			<RowOrgs
				onChange={this.form.onChange}
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
			>
				<Row
					rendered
					idx={1}
					title="1. Template Details"
				>
					<SelectQuestionnaireTemplateInput
						name="template"
						placeholder="Template"
						defaultValue={this.selectedTemplateDefault}
						className="col-lg-12 form-control"
						onChange={this.form.onChange}
					/>
				</Row>
			</RowOrgs>
			<Row
				rendered
				idx={2}
				title="2. Questionnaire"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				{selectedTemplate && <AnswerQuestions
					ref="questions"
					item={selectedTemplate}
					onChange={this.onChangeAnswer}
				/>}
				{selectedTemplate && <MKBox>No Inspection Questionnaire Template Selected</MKBox>}
					{/*<AnswerQuestions*/}
				{/*	SelectEmployeesDialog={SelectEmployeesDialog}*/}
				{/*	SelectEmployeeInput={SelectEmployeeInput}*/}
				{/*	SelectAssetInput={SelectAssetInput}*/}
				{/*/>*/}
			</Row>
		</FormControls>;
	}

	// </editor-fold>
}

function questionHasChat(ques) {
	return !(!ques.message_list || (ques.message_list && !isArray(ques.message_list) && !isObservableArray(ques.message_list)));
}

export default NewCheckableDialog;
