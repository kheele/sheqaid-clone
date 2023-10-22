// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {
	ClearableInput,
	RowOrgs,
	SelectAssetInput,
	SelectAssetTypeInput, SelectDepartmentInput, SelectEmployeeInput,
	SelectQuestionnaireTemplateInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import SelectEmployeesDialog from 'components/templates/SelectEmployeesDialog';
import ANewDialog from 'components/dialogs/ANewDialog';

import {TemplateQuestions} from 'components/templates';

import style from "./NewQuestionnaireDialog.lazy.css";
import insertInspectionsQuestionnaire
	from "mutations/all/Questionnaires/InspectionsQuestionnaires/insertInspectionsQuestionnaire";
import {Dates} from "utils/Dates";
import Divider from "@mui/material/Divider";
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
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/contractors/questionnaires/";

	@observable
	state = {
		lists: {
			interval: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Annually', 'Annually'].map(value => {
				return {value, label: value}
			})
		},
		selectedTemplate: null
	};

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.onNext = this.onNext.bind(this);
		this.getDialogDOM = this.getDialogDOM.bind(this);
		this.onFilterAsset = this.onFilterAsset.bind(this);

		const {dialog} = props;
		this.state.selectedTemplate = dialog.extraProp('template');

		this.form = new Form();
		this.form.addChangeOne("template", this.onChangeTemplate.bind(this));
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onChange funs">
	onChangeTemplate(el, val) {
		this.props.dialog.execWhen(() => this.refs.questions).then(ref => {
			if (val) {
				val = toJS(val);

				const {selectedTemplate} = this.state;
				if (!selectedTemplate || selectedTemplate.id !== val.id) {
					ref.item = this.state.selectedTemplate = val;
				}
			} else {
				ref.item = this.state.selectedTemplate = val;
			}
		});
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
		const {form, refs: {questions: questionsRef}} = this;
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
			client,
			project,
			site,
			//
			asset_type,
			asset,
			//
			responsible_person,
			responsible_department,
			interval,
			start_date,
			time,
			//
			template,
		} = form.data;
		const data = {
			client_id: client && client.id,
			project_id: project && project.id,
			site_id: site && site.id,
			//
			asset_type,
			asset_id: asset && asset.id,
			//
			responsible_person_id: responsible_person && responsible_person.id,
			responsible_department_id: responsible_department && responsible_department.id,
			interval,
			start_date: start_date && Dates.formatDateSQL(start_date),
			time,
			//
			template_id: template && template.id,
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

	getDialogDOM() {
		const {props: {dialog}} = this;
		return dialog.getDOMNode();
	}

	onFilterAsset() {
		const {asset_type} = this.refs;
		if (asset_type.hasValue) {
			return {asset_type: asset_type.value};
		}
	}

	get defaultTitlePageQuestions() {
		return [{questionText: "Completed By", questionType: "Short Answer"}];
	}

	get selectedTemplate() {
		const {selectedTemplate} = this.state;
		return selectedTemplate || this.props.state.item;
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {
			item, props: {
				onFormNext, onFormBack, onFormOpen
			}
		} = this;

		const data = item ? item.data : {};
		const {
			asset_type, asset,
			responsible_person, responsible_department, interval, start_date,
		} = data;

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
					title="1. Basic Info"
				>
					<SelectAssetTypeInput
						ref="asset_type"
						name="asset_type" placeholder="Asset Type..."
						defaultValue={asset_type}
						className="col-lg-12 form-control"
						onChange={this.form.onChange}
					/>
					<SelectAssetInput
						name="asset"
						placeholder="Asset..."
						defaultValue={asset}
						className="col-lg-12 form-control"
						onChange={this.form.onChange}
						onLoadFilter={this.onFilterAsset}
					/>
				</Row>
			</RowOrgs>
			<Row
				rendered
				idx={2}
				title="2. Responsible Person/Department & Schedule"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..."
				                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<SelectDepartmentInput name="responsible_department" placeholder="Responsible Department..."
				                       className="col-lg-12 form-control" onChange={this.form.onChange}/>

				<ClearableInput name="interval" type="select" placeholder="Interval..." className="col-lg-4 form-control"
				                onChange={this.form.onChange} values={this.state.lists.interval} returnValue/>
				<ClearableInput name="start_date" type="date" placeholder="Start Date..." className="col-lg-4 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="time" type="time" placeholder="Time..." className="col-lg-4 form-control"
				                onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Inspection Questionnaire"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<SelectQuestionnaireTemplateInput
					name="template"
					placeholder="Inspection Questionnaire Template"
					defaultValue={this.selectedTemplate}
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
					byLogged={byLogged}
				/>
				<Divider/>
				<TemplateQuestions
					ref="questions"
					getDialogDOM={this.getDialogDOM}
					defaultType="Inspections"
					mainTitle="Inspection Questionnaire"
					defaultDocTitle="Untitled Questionnaire"
					defaultTitlePageQuestions={this.defaultTitlePageQuestions}
					item={this.selectedTemplate}
					SelectEmployeesDialog={SelectEmployeesDialog}
				/>
			</Row>
		</FormControls>;
	}

	// </editor-fold>
}

const byLogged = sockets.of('inspections').fn('listTemplatesByLogged');

export default NewQuestionnaireDialog;
