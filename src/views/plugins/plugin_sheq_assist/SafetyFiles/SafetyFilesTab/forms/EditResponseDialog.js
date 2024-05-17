// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable} from 'mobx';
import {
	Button, ClearableInput,
	ProfileField,
	RowOrgs,
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import {AnswerQuestions} from 'components/checkables';

import {AControls, Compliance, questionnairesOnUpdate, Stats} from 'components/questionnaires/AResponseUtils';

import style from "./EditResponseDialog.lazy.css";
import updateQuestionnaire from "mutations/all/Questionnaires/Questionnaires/updateQuestionnaire";

import findByIdSafetyFilesQuestionnaire
	from "mutations/all/Questionnaires/SafetyFilesQuestionnaires/findByIdSafetyFilesQuestionnaire";
import {Dates} from "utils/Dates";

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends ANewDialog {
	pageKey = "EditResponseDialog";
	findById = findByIdSafetyFilesQuestionnaire;
	removeById = updateQuestionnaire;
	
	constructor(props) {
		super(props, style);
		
		this.onSetAsComplete = this.onSetAsComplete.bind(this);
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
	
	onSetAsComplete(evt, elem) {
		const d = new Date();
		this.onUpdateImpl({
			status: 'CompleteAccepted',
			date_completed: Dates.formatDateSQL(d),
			time_completed: Dates.formatTime(d),
		});
	}
	
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
	
	get isLoggedUser() {
		const {user} = storage.loggedUser;
		const {data: {responsible_person_list, responsible_user}} = this.item;
		if (responsible_user) {
			return responsible_user.id === user.id;
		}
		if(responsible_person_list) {
			return responsible_person_list.anyMatch(v => v.linked_user_id === user.id);
		}
	}
	
	get title() {
		return "Questionnaire Responses";
	}
	
	@computed get topButtons() {
		const {item} = this.state;
		if (!item) return null;
		const {
			id, data: {
				status = "New",
			}
		} = item;
		
		const shouldSetAsComplete = this.isLoggedUser && status !== "CompleteAccepted";
		
		return <>
			{(shouldSetAsComplete) &&
				<Button className="btn btn-primary" onClick={this.onSetAsComplete}>
					Set As Complete <i className="fa fa-check icon-right font-size-16"/>
				</Button>}
			<Button className="btn btn-primary cancel" onClick={this.onCancel}>
				<i className="fa fa-times icon-left"/>Cancel
			</Button>
			<Button ref={ref => this.refs.saveB = ref} className="btn btn-primary save" onClick={this.onSubmit}>
				<i className="fa fa-check icon-left"/>Save
			</Button>
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
	group = "Safety Files";
	
	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);
		
		this.onUpdate = this.onUpdate.bind(this);
		
		this.onActionAsComplete = this.onActionAsComplete.bind(this);
		this.onActionQuestionnaire = this.onActionQuestionnaire.bind(this);
	}
	
	// </editor-fold>
	
	componentWillUnmount() {
		if (this.unsubscribe && isFunction(this.unsubscribe)) {
			// this.unsubscribe();
		}
		this.unsubscribe = null;
	}
	
	onUpdate() {
		if (this.unsubscribe) {
			return;
		}

// 		const {item} = this;
// 		this.unsubscribe = subscribeByIdContractorQuestionnaire({
// 			id: item.id,
// 			onEvent: res => {
// 				console.log(`subscription`, res)
// //            alert('ProfileResponseDialog')
// // 				questionnairesOnUpdate(item, {updateVal, data});
// 			},
// 		});
	}
	
	// <editor-fold defaultstate="collapsed" desc="onActionAsComplete">
	onActionAsComplete(evt, el) {
		const {status} = el.props;
		this.onUpdateImpl({status});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onActionQuestionnaire">
	onActionQuestionnaire(evt, el) {
		const {status_answered_by_sender} = el.props;
		this.onUpdateImpl({status_answered_by_sender});
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		btn.text("Saving...").disabled();
		setTimeout(() => {
			infoDialog.open("Record successfully updated.");
			infoDialog.close(2000);
			this.props.close();
		}, 1000);
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="onUpdateImpl">
	onUpdateImpl(attrs, showConfirm = true) {
		let promise;
		if (showConfirm) {
			promise = confirmDialog.open("Are you sure you want to confirm this action?");
		} else {
			promise = Promise.resolve(1);
		}
		promise.then(res => {
			if (res === 1) {
				showConfirm && progressDialog.open("Please wait...");
				updateQuestionnaire({id: this.item.id, ...attrs}).then(res => {
					//            console.log("res", res)
					extendObservable(this.item.data, attrs);
					//            onSaved && onSaved(res);
					if (showConfirm) {
						infoDialog.open("Record successfully updated.");
						infoDialog.close(2000);
					}
				}).finally(() => {
					showConfirm && progressDialog.close();
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
					total_answered,
					total_compliance,
					total_deviations,
					total_non_deviations,
					total_questions,
					total_unanswered,
					//
					due_date,
					responsible_person_list,
					responsible_person_other_list,
					responsible_user,
					//
					template
				}
			}
		} = this;
//        console.log('item', item)
		
		return <FormControls>
			<Row
				rendered
				idx={1}
				title="1. Compliance Summary"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				<div className="row margin-0 flex">
					<Stats value={total_questions} title='Total Questions'/>
					<Stats value={total_questions-total_compliance} title='Non-Compliance'/>
					<Stats value={total_compliance} title='Compliance'/>
					{/*<Compliance list={total_questions-total_compliance} title='Non-Compliance' status={status}/>*/}
					{/*<Compliance list={total_compliance} title='Compliance' status={status}/>*/}
				</div>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Asset Details"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				{/* <ProfileField name="asset_type" placeholder="Asset Type" value={asset_type} className="col-lg-12"/>
				<ProfileField name="asset" placeholder="Asset" value={asset} renderer={v => v.asset_detail.name}
				              className="col-lg-12"/> */}
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Responsible Person/Department & Schedule"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormBack={onFormBack}
			>
				<ProfileField name="responsible_person_list" placeholder="Responsible Employee(s)" value={responsible_person_list || []}
				              renderer={v => v.map(v => v.full_name).join(', ')} className="col-lg-12"/>
				<ProfileField name="responsible_person_other_list" placeholder="Responsible External Person(s)" value={responsible_person_other_list || []}
				              renderer={v => v.map(v => v.full_name).join(', ')} className="col-lg-12"/>
				<ProfileField name="responsible_user" placeholder="Responsible User" value={responsible_user}
				              renderer={v => v.full_name} className="col-lg-12"/>
							  
				<ProfileField name="due_date" placeholder="Due Date" type="date" value={due_date} className="col-lg-4"/>
			</Row>
			<Row
				rendered
				idx={4}
				title="4. Safety File Questionnaire"
				sectionClassName="-margin-l-5"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<ProfileField name="template" placeholder="Safety File Questionnaire Template" value={template}
				              renderer={v => v.name} className="col-lg-12 margin-l-5"/>
				<AnswerQuestions
					ref="questions"
					defaultType="Safety Files"
					mainTitle="Safety File Questionnaire"
					item={this.item}
					onChange={this.onUpdateAnswer}
				/>
			</Row>
		</FormControls>;
	}
	
	// </editor-fold>
}

export default EditDialog;
