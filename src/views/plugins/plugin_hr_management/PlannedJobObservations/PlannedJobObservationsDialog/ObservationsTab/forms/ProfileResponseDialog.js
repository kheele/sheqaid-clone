// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable} from 'mobx';
import {Button, ProfileField} from 'components/inputs';
import NavItem from 'components/navs/NavItem';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import ProfileQuestionnairePDFReader from 'components/questionnaires/printers/ProfileQuestionnairePDFReader';
import ProfileResponsePDFReader from 'components/questionnaires/printers/ProfileResponsePDFReader';

import {AnswerQuestions} from 'components/checkables';

import {AControls, Compliance, questionnairesOnUpdate, Stats} from 'components/questionnaires/AResponseUtils';

import style from "./ProfileResponseDialog.lazy.css";
import updateQuestionnaire from "mutations/all/Questionnaires/Questionnaires/updateQuestionnaire";
import subscribeByIdContractorQuestionnaire
	from "../../../../../plugin_extra/__B_Contractors/AQuestionnaireTab/Subscription/subscribeByIdContractorQuestionnaire";

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AEditDialog {
	pageKey = "ProfileResponseDialog";

	constructor(props) {
		super(props, style);

		this.onExportOptions = this.onExportOptions.bind(this);
	}

	open(item) {
		this.execWhen(() => this.refs.dialog).then(dialog => {
			dialog.setTopButtons(this.topButtons);
			this.execWhen(() => this.refs.controls).then(controls => {
				controls.onUpdate();
			});
		});
		return super.open(item);
	}

	onExportOptions(e, btn) {
		this.refs.controls.onExportOptions(e, btn);
	}

	get title() {
		return "Questionnaire Responses";
	}

	get topButtonsHiddenDelete() {
		return true;
	}

	get topButtonsHiddenSave() {
		return true;
	}

	@computed get topButtons() {
		return <>
			<Button ref={ref => this.refs.infoB = ref} className="btn btn-primary progress-bar"/>
			{/*<Button className="btn btn-primary" onClick={this.onExportOptions}>
                Export <i className="fa fa-angle-down icon-right font-size-16"/>
            </Button>*/}
		</>;
	}

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AControls {
	path = "plugin_sheq_assist/contractors/questionnaires/";

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.onUpdate = this.onUpdate.bind(this);

		this.onExportOptions = this.onExportOptions.bind(this);
		this.onExport = this.onExport.bind(this);
		this.onSaveAs = this.onSaveAs.bind(this);
	}

	// </editor-fold>

	componentWillUnmount() {
		if (this.unsubscribe && isFunction(this.unsubscribe)) {
			this.unsubscribe();
		}
		this.unsubscribe = null;
	}

	onUpdate() {
		if (this.unsubscribe) {
			return;
		}

		const {item} = this;
		this.unsubscribe = subscribeByIdContractorQuestionnaire({
			id: item.id,
			onEvent: res => {
				console.log(`subscription`, res)
//            alert('ProfileResponseDialog')
// 				questionnairesOnUpdate(item, {updateVal, data});
			},
		});
	}

	// <editor-fold defaultstate="collapsed" desc="onExportOptions, onExport, onSaveAs">
	onExportOptions(e, btn) {
//        this.refs.pdfReader.open(this.item);

		const jqElem = $(btn.getDOMNode());
		const {left, top} = jqElem.offset();
		const style = {
			left,
			top: top + jqElem.height() + 25,
			width: "auto",
			minWidth: 200
		};
		popover.settings({
			style,
			isDialog: true,
			contentNode: <div>
				<NavItem type="Questionnaire" onClick={this.onExport} faIconLeft="file-pdf-o" title="Export Questionnaire"/>
				<NavItem type="Response" onClick={this.onExport} faIconLeft="file-pdf-o" title="Export Responses"/>
			</div>
		}).open();
	}

	onExport(e, el) {
		const {idx, type, title} = el.props;
		setTimeout(() => {
			const jqElem = $(btn.getDOMNode());
			const {left, top} = jqElem.offset();
			const style = {
				left,
				top: top + jqElem.height() + 25,
				width: "auto",
				minWidth: 200
			};
			popover.settings({
				style,
				isDialog: true,
				contentNode: <div>
					<p className="padding-t-10 text-center">{title}</p>
					<hr className="margin-t-0 margin-b-0"/>
					<NavItem idx={idx} type='PDF' refName={`profile${type}PDFReader`} onClick={this.onSaveAs}
					         title='Save As PDF'/>
					<NavItem idx={idx} type='Excel' onClick={this.onSaveAs} title='Save As Spreadsheet'/>
				</div>
			}).open();
		}, 600);
	}

	async onSaveAs(e, el) {
		const {idx, type, refName} = el.props;
		const {[refName]: dialog} = this.refs;
		if (type === 'PDF') {
			dialog.open(this.item);
		} else if (type === 'Excel') {

		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onUpdateImpl">
	onUpdateImpl(attrs, showDialogs = true) {
		confirmDialog.open("Are you sure you want to confirm this action?").then(res => {
			if (res === 1) {
				showDialogs && progressDialog.open("Please wait...");
				updateQuestionnaire({id: this.item.id, ...attrs}).then(res => {
					console.log("res", res)
					extendObservable(this.item.data, attrs);
					//            onSaved && onSaved(res);
					if (showDialogs) {
						infoDialog.open("Record successfully updated.");
						infoDialog.close(2000);
					}
				}).finally(() => {
					showDialogs && progressDialog.close();
				});
			}
		});
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		if (!this.item)
			return null;
		const {
			props: {
				onFormNext, onFormBack, onFormOpen
			},
			item, item: {
				id, data: {
					created_at,
					name,
					desc,
					status,
					status_answered_by_sender,
					is_template,
					type,
					visibility,
					scheduled,
					page_title_list,
					question_list,
					//
					interval,
					start_date,
					time,
					responsible_person,
					responsible_department,
					job_position,
					employee,
					employee_other,
					//
					template
				}
			}
		} = this;
		console.log('item', item)

		return <FormControls>
			<Row
				rendered
				idx={1}
				title="1. Compliance Summary"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				<div className="row margin-0 flex">
					<Stats value={question_list} title='Total Questions'/>
					<Compliance list={question_list} title='Non-Compliance' status={status}/>
					<Compliance list={question_list} title='Compliance' status={status}/>
				</div>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Basic Info"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<ProfileField name="job_position" placeholder="Job Position" value={job_position} renderer={v => v.name} className="col-lg-12"/>
				<ProfileField name="employee" placeholder="Employee" value={employee || employee_other}
				              renderer={v => v.full_name} className="col-lg-12"/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Responsible Person/Department & Schedule"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<ProfileField name="responsible_person" placeholder="Responsible Person" value={responsible_person}
				              renderer={v => v.full_name} className="col-lg-12"/>
				<ProfileField name="responsible_department" placeholder="Responsible Department" value={responsible_department}
				              renderer={v => v.name} className="col-lg-12"/>

				<ProfileField name="interval" placeholder="Interval" value={interval} className="col-lg-4"/>
				<ProfileField name="start_date" type="date" placeholder="Start Date" value={start_date} className="col-lg-4"/>
				<ProfileField name="time" placeholder="Time" value={time} className="col-lg-4"/>
			</Row>
			<Row
				rendered
				idx={4}
				title="4. Job Observation Questionnaire"
				sectionClassName="-margin-l-5"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<ProfileField name="template" placeholder="Job Observation Questionnaire Template" value={template}
				              renderer={v => v.name} className="col-lg-12 margin-l-5"/>
				<AnswerQuestions
					ref="questions"
					defaultType="Job Observations"
					mainTitle="Job Observation Questionnaire"
					readonly
					item={this.item}
					onChange={this.onUpdateAnswer}
				/>
			</Row>
			<ProfileQuestionnairePDFReader ref="profileQuestionnairePDFReader"/>
			<ProfileResponsePDFReader ref="profileResponsePDFReader"/>
		</FormControls>;
	}

	// </editor-fold>
}

export default ProfileDialog;
