// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {
	ClearableInput,
	ProfileField,
	RowOrgs,
	SelectAssetInput,
	SelectAssetTypeInput, SelectDepartmentInput,
	SelectEmployeeInput, SelectQuestionnaireTemplateInput, SelectUserInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import SelectEmployeesDialog from 'components/templates/SelectEmployeesDialog';
import {AEditDialog} from 'components/dialogs';

import {TemplateQuestions} from 'components/templates';

import style from "./EditQuestionnaireDialog.lazy.css";
import updateContractorsQuestionnaire
	from "mutations/all/Questionnaires/ContractorsQuestionnaires/updateContractorsQuestionnaire";
import {ShouldUpdate} from "utils/Utils";
import updateSafetyFilesQuestionnaire
	from "mutations/all/Questionnaires/SafetyFilesQuestionnaires/updateSafetyFilesQuestionnaire";
import Divider from "@mui/material/Divider";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditQuestionnaireDialog extends AEditDialog {
	pageKey = "EditQuestionnaireDialog";

	constructor(props) {
		super(props, style);
	}

	get title() {
		return "Edit Safety File Questionnaire";
	}

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/contractors/questionnaires/";

	@observable
	state = {};

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
		if (idx === 0) {
			const {isConsultant} = storage.is;
			if (isConsultant && !form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}
		}
		if (idx === 1) {
			// if (!form.isValid('asset_type')) {
			// 	infoDialog.open('Asset Type is required');
			// 	return;
			// }
		}
		if (idx === 3) {
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
		const {isConsultant} = storage.is;
		if (isConsultant && !form.isValid('client')) {
			infoDialog.open('Company is required');
			return;
		}

		// if (!form.isValid('asset_type')) {
		// 	infoDialog.open('Asset Type is required');
		// 	return;
		// }

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

		const {
			asset_type, asset,
			//
			responsible_person_list, responsible_user, due_date,
		} = form.data;
		const data = {
			// is_template: false,
			// name,
			// desc,
			// question_list,
		};

		ShouldUpdate.check(data, old_data, asset_type, 'asset_type');
		ShouldUpdate.checkAsset(data, old_data, asset, 'asset');

		//
		// ShouldUpdate.checkEmployee(data, old_data, responsible_person_list, 'responsible_person_list');
		ShouldUpdate.checkUser(data, old_data, responsible_user, 'responsible_user');
		ShouldUpdate.checkDate(data, old_data, due_date, 'due_date');

		//
		ShouldUpdate.check(data, old_data, name, 'name');
		ShouldUpdate.check(data, old_data, desc, 'desc');
		ShouldUpdate.checkListToJS(data, old_data, question_list, 'question_list');

		console.log(data)

		btn.text("Saving...").disabled();
		updateSafetyFilesQuestionnaire({id: this.item.id, ...data}).then(res => {
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

	get selectedTemplate() {
		const {template} = this.item.data;
		return template;
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
					answered_by = 'Sender',
					is_template,
					visibility,
					page_title_list,
					question_list,
					//
					template,
					//
					responsible_person_list,
					responsible_person_other_list,
					responsible_user,
					due_date,
				}
			}
		} = this;

		console.log(this.item)
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
					title="1. Asset Details"
				>
					{/* <SelectAssetTypeInput
						ref="asset_type"
						name="asset_type"
						placeholder="Asset Type..."
						defaultValue={asset_type}
						className="col-lg-12 form-control"
						onChange={this.form.onChange}
					/>
					<SelectAssetInput
						name="asset"
						placeholder="Asset..."
						className="col-lg-12 form-control"
						defaultValue={asset}
						onChange={this.form.onChange}
						onLoadFilter={this.onFilterAsset}
					/> */}
				</Row>
			</RowOrgs>
			<Row
				rendered
				idx={2}
				title="2. Responsible Persons"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<SelectEmployeeInput 
					name="responsible_person_list" 
					type="select_multi"
					placeholder="Responsible Employee(s)..."
					defaultValue={responsible_person_list}
					className="col-lg-12 form-control" 
					onChange={this.form.onChange}
				/>
				<SelectEmployeeInput 
					name="responsible_person_other_list" 
					type="select_multi"
					placeholder="Responsible External Person(s)..."
					defaultValue={responsible_person_other_list}
					className="col-lg-12 form-control" 
					onChange={this.form.onChange}
					showOtherPersonsOnly
				/>
				<SelectUserInput name="responsible_user" placeholder="Responsible User..."
				                     defaultValue={responsible_user} className="col-lg-12 form-control"
				                     onChange={this.form.onChange}/>

				<ClearableInput name="due_date" type="date" placeholder="Due Date..." defaultValue={due_date}
				                className="col-lg-4 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Safety File Questionnaire"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<SelectQuestionnaireTemplateInput
					name="template"
					placeholder="Safety File Questionnaire Template"
					defaultValue={this.selectedTemplate}
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
					byLogged={byLogged}
				/>
				<Divider/>
				<TemplateQuestions
					ref="questions"
					getDialogDOM={this.getDialogDOM}
					isEditting
					defaultType="Safety Files"
					mainTitle="Safety File Questionnaire"
					defaultDocTitle="Untitled Questionnaire"
					item={this.item}
					SelectEmployeesDialog={SelectEmployeesDialog}
				/>
			</Row>
		</FormControls>;
	}

	// </editor-fold>
}

const byLogged = sockets.of('safety-files').fn('listTemplatesByLogged');

export default EditQuestionnaireDialog;
