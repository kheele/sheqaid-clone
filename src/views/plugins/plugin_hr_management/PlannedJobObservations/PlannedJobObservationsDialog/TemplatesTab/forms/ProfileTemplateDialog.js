import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import {AProfileDialog} from 'components/dialogs';

import {TemplateQuestions} from 'components/templates';

import style from "./ProfileTemplateDialog.lazy.css";
import {FormControls, Row} from "components/FormComponents";
import {Button, Clickable, ProfileField} from "components/inputs";
import NewTemplateDialog from "./NewTemplateDialog";
import EditTemplateDialog from "./EditTemplateDialog";
import NewQuestionnaireDialog from "../../ObservationsTab/forms/NewQuestionnaireDialog";
import ProfilePDFReader from "../printers/ProfileTemplatePDFReader";
import NavItem from "components/navs/NavItem";

import updateJobObservationsQuestionnaireTemplate
	from "mutations/all/Questionnaires/JobObservationsQuestionnaireTemplate/updateJobObservationsQuestionnaireTemplate";
import findByIdJobObservationsQuestionnaireTemplate
	from "mutations/all/Questionnaires/JobObservationsQuestionnaireTemplate/findByIdJobObservationsQuestionnaireTemplate";

//<editor-fold desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
	pageKey = "ProfileTemplateDialog";
	findById = findByIdJobObservationsQuestionnaireTemplate;

	constructor(props) {
		super(props, style);

		this.onCopy = this.onCopy.bind(this);
		this.onStartJobObservation = this.onStartJobObservation.bind(this);

		this.onSaveAsOptions = this.onSaveAsOptions.bind(this);

		this.onEdit = this.onEdit.bind(this);
	}

	onCopy(evt, el) {
		this.refs.controls.onCopy(evt, el);
	}

	onStartJobObservation(evt, el) {
		this.refs.controls.onStartJobObservation(evt, el);
	}

	onEdit(evt, el) {
		this.refs.controls.onEdit(evt, el);
	}

	onSaveAsOptions(e, btn) {
		this.refs.controls.onSaveAsOptions(e, btn);
	}

	title() {
		return "Job Observation Template Questionnaire";
	}
	
	get removeById() {
		if(!this.isOpen) return updateJobObservationsQuestionnaireTemplate;
		
		const {item} = this.state;
		if (!item) return null;
		const {data: {visibility}} = item;
		
		if (visibility === "Private") {
			return updateJobObservationsQuestionnaireTemplate;
		}
	}
	
	@computed get topButtons() {
		const {item} = this.state;
		if (!item) return null;
		const {
			data: {
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
			}
		} = item;

		const isPrivate = visibility === "Private";
		const isWritable = isPrivate;

		return <React.Fragment>
			{isWritable && <Button className="btn btn-primary" onClick={this.onDelete}>
				<i className="fa fa-ban icon-left"/>Delete
			</Button>}
			{isWritable && <Button className="btn btn-primary" onClick={this.onEdit}>
				<i className="fa fa-pen icon-left"/>Edit
			</Button>}

			<Button className="btn btn-primary" onClick={this.onSaveAsOptions}>
				Save As <i className="fa fa-angle-down icon-right font-size-16"/>
			</Button>
			<Button className="btn btn-primary" onClick={this.onStartJobObservation}>
				<i className="fa fa-plus icon-left"/>Start Job Observation
			</Button>
			<Button className="btn btn-primary" onClick={this.onCopy}>
				<i className="fa fa-copy icon-left"/>Copy
			</Button>
		</React.Fragment>;
	}

	get controls() {
		return Controls;
	}
}

//</editor-fold>

@observer
class Controls extends React.Component {

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);

		this.onSaveAsOptions = this.onSaveAsOptions.bind(this);
		this.onSaveAs = this.onSaveAs.bind(this);

		this.getDialogDOM = this.getDialogDOM.bind(this);
	}

	//</editor-fold>

	onEdit(evt, el) {
		this.refs.editDialog.open(this.item);
	}

	onCopy(evt, elem) {
		const copy = toJS(this.item);
		this.refs.newDialog.open(copy);
	}

	//<editor-fold desc="onStartJobObservation">
	onStartJobObservation(evt, elem) {
		const copy = toJS(this.item);
		this.refs.newQuestionnaireDialog.open(copy);
	}
	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSaveAsOptions">
	onSaveAsOptions(e, btn) {
//        this.refs.pdfReader.open(this.item);
		popover.settings({
			style: {width: 'auto', minWidth: 200},
			isDialog: true,
			contentNode: <div>
				<NavItem type='PDF' refName={`pdfReader`} onClick={this.onSaveAs} title='Save As PDF'/>
				<NavItem type='Excel' onClick={this.onSaveAs} title='Save As Spreadsheet'/>
			</div>
		}).open();
	}

	async onSaveAs(e, el) {
		const {idx, type} = el.props;
		if (type === 'PDF') {
			this.refs.pdfReader.open(this.item);
		} else if (type === 'Excel') {

		}
	}

	// </editor-fold>

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
				onFormNext, onFormBack, onFormOpen
			},
			item: {
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
					job_position,
				}
			}
		} = this;

		return <FormControls>
			<Row
				rendered
				active
				idx={1}
				title="1. Basic Info"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				<ProfileField name="visibility" placeholder="Visibility" value={visibility} className="col-lg-12"/>
				<ProfileField name="job_position" placeholder="Job Position" value={job_position} renderer={v => v.name} className="col-lg-12"/>
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
					readonly
					isLibrary
					isPrivate={visibility === 'OnlyMyCompany'}
					getDialogDOM={this.getDialogDOM}
					defaultType="Job Observations"
					mainTitle="Job Observation Template Questionnaire"
					item={this.item}
				/>
			</Row>

			<NewTemplateDialog ref="newDialog"/>
			<EditTemplateDialog ref="editDialog"/>

			<NewQuestionnaireDialog ref="newQuestionnaireDialog"/>

			<ProfilePDFReader ref="pdfReader"/>
		</FormControls>;
	}

	//</editor-fold>

}

export default ProfileDialog;
