// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {
	ClearableInput,
	RowOrgs,
	SelectAssetInput,
	SelectAssetTypeInput, SelectDepartmentInput, SelectEmployeeInput,
	SelectQuestionnaireTemplateInput, SelectUserInput
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import SelectEmployeesDialog from 'components/templates/SelectEmployeesDialog';
import ANewDialog from 'components/dialogs/ANewDialog';

import {TemplateQuestions} from 'components/templates';

import style from "./NewQuestionnaireDialog.lazy.css";
import insertInspectionsQuestionnaire
	from "mutations/all/Questionnaires/InspectionsQuestionnaires/insertInspectionsQuestionnaire";
import {Dates} from "utils/Dates";
import {execWhen} from "utils/Utils";
import Divider from "@mui/material/Divider";
import findByIdInspectionsQuestionnaireTemplate
	from "mutations/all/Questionnaires/InspectionsQuestionnaireTemplate/findByIdInspectionsQuestionnaireTemplate";
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
		
		this.loadTemplate = this.loadTemplate.bind(this);
		
		this.form = new Form();
		this.form.addChangeOne("asset_type", this.onChangeAssetType.bind(this));
		this.form.addChangeOne("template", this.onChangeTemplate.bind(this));
	}
	
	// </editor-fold>
	
	async componentWillMount() {
		const {dialog} = this.props;
		
		const template = dialog.extraProp('template');
		if (template) {
			await this.loadTemplate(template);
		}
	}
	
	// <editor-fold defaultstate="collapsed" desc="onChange funs">
	async onChangeAssetType(el, val) {
		execWhen(() => this.refs.asset).then(ref => {
			ref.update();
		});
	}
	
	async onChangeTemplate(el, val) {
		if (val) {
			const {selectedTemplate} = this.state;
			if (!selectedTemplate || selectedTemplate.id !== val.id) {
				await this.loadTemplate(val);
			}
		} else {
			// ref.item = this.state.selectedTemplate = val;
		}
	}
	
	// </editor-fold>
	
	async loadTemplate(val) {
		progressDialog.open();
		this.props.dialog.execWhen(() => this.refs.questions).then(async ref => {
			try {
				val = await findByIdInspectionsQuestionnaireTemplate(val.id);
				
				if (val) {
					ref.item = this.state.selectedTemplate = val;
				} else {
					infoDialog.open("Could not load the template. Please check your internet connection and try again.");
				}
			} catch (err) {
				console.error('loadTemplate', err);
			} finally {
				progressDialog.close();
			}
		});
	}
	
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
		
		if (!form.isValid('asset_type') && !form.isValid('asset')) {
			infoDialog.open('Asset Type / Asset must be selected');
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
		
		const {
			client,
			project,
			site,
			//
			asset_type,
			asset,
			//
			responsible_person_list,
			responsible_person_other_list,
			responsible_user,
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
			responsible_person_list: {
				data: [
					...(responsible_person_list || []).map(({id: employee_id, is_external, ...attrs}) => ({employee_id})),
				],
			},
			responsible_person_other_list: {
				data: [
					...(responsible_person_other_list || []).map(({id: employee_other_id, ...attrs}) => {
						if(employee_other_id) {
							return {employee_other_id};
						}
						const data = {...attrs};
						// delete data.is_external;
						return {employee_other: {data}};
					}),
				],
			},
			responsible_user_id: responsible_user && responsible_user.id,
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
			return {asset_type: asset_type.value.value};
		}
	}
	
	get defaultTitlePageQuestions() {
		return [{questionText: "Completed By", questionType: "Short Answer"}];
	}
	
	get selectedTemplate() {
		const {selectedTemplate} = this.state;
		return selectedTemplate || this.props.state.item;
	}
	
	get asset() {
		return this.props.dialog.props.asset;
	}
	//Ray: Accounting & HR, (Ed, Love, Dave, And), Anel: Sales Manager, Charlemagne: , IT Manager
	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		let {
			selectedTemplate,
			props: {
				onFormNext, onFormBack, onFormOpen
			},
			asset,
		} = this;
		
		let asset_type,
			responsible_person_list, responsible_person_other_list, responsible_user, responsible_department, interval, start_date, time;
		
		if (asset) {
			asset_type = asset.data.asset_detail.asset_type;
		} else {
			console.log("selectedTemplate", selectedTemplate)
			const data = selectedTemplate ? selectedTemplate.data : {};
			const {
				asset_type: _asset_type,
				asset: _asset,
				responsible_person_list: _responsible_person_list,
				responsible_person_other_list: _responsible_person_other_list,
				responsible_user: _responsible_user,
				responsible_department: _responsible_department,
				interval: _interval,
				start_date: _start_date,
				time: _time,
			} = data;
			//
			asset = _asset;
			asset_type = _asset_type;
			//
			responsible_person_list = _responsible_person_list;
			responsible_person_other_list = _responsible_person_other_list;
			responsible_user = _responsible_user;
			responsible_department = _responsible_department;
			interval = _interval;
			start_date = _start_date;
			time = _time;
		}
		
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
						readonly={!!asset}
						isEditable={!asset}
						className="col-lg-12 form-control"
						onChange={this.form.onChange}
					/>
					<SelectAssetInput
						ref="asset"
						name="asset"
						placeholder="Asset..."
						defaultValue={asset}
						readonly={!!asset}
						isEditable={!asset}
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
				<SelectEmployeeInput name="responsible_person_list" placeholder="Responsible Employee(s)..."
				                     defaultValue={responsible_person_list}
				                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<SelectEmployeeInput
					name="responsible_person_other_list" placeholder="Responsible External Person(s)..."
					defaultValue={responsible_person_other_list}
					type="select_multi"
					className="col-lg-12 form-control"
					onChange={this.form.onChange}
					showOtherPersonsOnly
				/>
				<SelectUserInput name="responsible_user" placeholder="Responsible User..."
				                     defaultValue={responsible_user}
				                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<SelectDepartmentInput name="responsible_department" placeholder="Responsible Department..."
				                       defaultValue={responsible_department}
				                       className="col-lg-12 form-control" onChange={this.form.onChange}/>
				
				<ClearableInput name="interval" type="select" placeholder="Interval..." className="col-lg-4 form-control"
				                defaultValue={interval}
				                onChange={this.form.onChange} values={this.state.lists.interval} returnValue/>
				<ClearableInput name="start_date" type="date" placeholder="Start Date..." className="col-lg-4 form-control"
				                defaultValue={start_date}
				                onChange={this.form.onChange}/>
				<ClearableInput name="time" type="time" placeholder="Time..." className="col-lg-4 form-control"
				                defaultValue={time}
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
					className="col-lg-12 w-900 margin-t-20 margin-b-15 hor-center form-control"
					onChange={this.form.onChange}
					byLogged={byLogged}
				/>
				<Divider sx={{mb: "20px"}}/>
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
