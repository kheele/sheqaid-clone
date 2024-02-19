// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable} from 'mobx';
import {Button} from 'components/inputs';
import NavItem from 'components/navs/NavItem';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import ProfileQuestionnairePDFReader from '../printers/ProfileQuestionnairePDFReader';
import ProfileResponsePDFReader from '../printers/ProfileResponsePDFReader';

import {AnswerQuestions} from 'components/checkables';

import {AControls, Compliance, questionnairesOnUpdate, Stats} from 'components/questionnaires/AResponseUtils';

import style from "./ProfileResponseDialog.lazy.css";
import updateQuestionnaire from "mutations/all/Questionnaires/Questionnaires/updateQuestionnaire";
import subscribeByIdContractorQuestionnaire
	from "../AQuestionnaireTab/Subscription/subscribeByIdContractorQuestionnaire";
import findByIdContractorsQuestionnaire
	from "mutations/all/Questionnaires/ContractorsQuestionnaires/findByIdContractorsQuestionnaire";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AEditDialog {
	pageKey = "ProfileResponseDialog";
	findById = findByIdContractorsQuestionnaire;

	constructor(props) {
		super(props, style);

		this.onCompletionOptions = this.onCompletionOptions.bind(this);
		this.onRequestsOptions = this.onRequestsOptions.bind(this);
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

	onCompletionOptions(e, btn) {
		this.refs.controls.onCompletionOptions(e, btn);
	}

	onRequestsOptions(e, btn) {
		this.refs.controls.onRequestsOptions(e, btn);
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
		const {item} = this.state;
		if (!item) return null;
		const {
			id, data: {
				status = "New", status_answered_by_sender, answered_by = 'Recipient',
			}
		} = item;

		const {isContractor} = storage.is;

		const isAnsweredBySender = answered_by === "Sender";

		let shoudMarkAsComplete;
		let shoudAcceptAsComplete;
		let shoudDeclineAsComplete;

		let shouldRequestApproval;
		let shouldAcceptQuestionnaire;
		let shouldDeclineQuestionnaire;

		if (isAnsweredBySender) {
			if (isContractor) {
				shoudAcceptAsComplete = status === "CompleteRequested" || status === "CompleteDeclined";
				shoudDeclineAsComplete = status === "CompleteRequested";

				shouldAcceptQuestionnaire = status_answered_by_sender === "ApprovalRequested" || status_answered_by_sender === "ApprovalDeclined";
				shouldDeclineQuestionnaire = status_answered_by_sender === "ApprovalRequested";
			} else {
				shouldRequestApproval = status_answered_by_sender !== "ApprovalRequested" && status_answered_by_sender !== "ApprovalAccepted";
				if (!shouldRequestApproval) {
					shoudMarkAsComplete = status_answered_by_sender === "ApprovalAccepted" && status !== "CompleteRequested" && status !== "CompleteAccepted";
				}
			}
		} else {
			if (isContractor) {
				shoudMarkAsComplete = status !== "CompleteRequested" && status !== "CompleteAccepted";

				shouldAcceptQuestionnaire = status_answered_by_sender === "ApprovalRequested" || status_answered_by_sender === "ApprovalDeclined";
				shouldDeclineQuestionnaire = status_answered_by_sender === "ApprovalRequested";
			} else {
				shoudAcceptAsComplete = status === "CompleteRequested" || status === "CompleteDeclined";
				shoudDeclineAsComplete = status === "CompleteRequested";

//                shouldRequestApproval = status_answered_by_sender !== "ApprovalRequested" && status_answered_by_sender !== "ApprovalAccepted";
			}
		}

		return <React.Fragment>
			<Button ref={ref => this.refs.infoB = ref} className="btn btn-primary progress-bar"/>
			{/*<Button className="btn btn-primary" onClick={this.onExportOptions}>
                Export <i className="fa fa-angle-down icon-right font-size-16"/>
            </Button>*/}
			{(shoudMarkAsComplete || shoudAcceptAsComplete || shoudDeclineAsComplete) &&
				<Button className="btn btn-primary" onClick={this.onCompletionOptions}>
					Completion Options <i className="fa fa-angle-down icon-right font-size-16"/>
				</Button>}
			{(shouldRequestApproval || shouldAcceptQuestionnaire || shouldDeclineQuestionnaire) &&
				<Button className="btn btn-primary" onClick={this.onRequestsOptions}>
					Requests Options <i className="fa fa-angle-down icon-right font-size-16"/>
				</Button>}
		</React.Fragment>;
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

		this.onActionAsComplete = this.onActionAsComplete.bind(this);
		this.onActionQuestionnaire = this.onActionQuestionnaire.bind(this);

		this.onCompletionOptions = this.onCompletionOptions.bind(this);
		this.onRequestsOptions = this.onRequestsOptions.bind(this);

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

// 		const {item} = this;
// 		this.unsubscribe = subscribeByIdContractorQuestionnaire({
// 			id: item.id,
// 			onEvent: res => {
//            console.log(`subscription`, res)
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

	// <editor-fold defaultstate="collapsed" desc="onCompletionOptions">
	onCompletionOptions(e, btn) {
		const {
			id, data: {
				status = "New", status_answered_by_sender, answered_by = 'Recipient',
			}
		} = this.item;

		const {isContractor} = storage.is;

		const isAnsweredBySender = answered_by === "Sender";

		let shoudMarkAsComplete;
		let shoudAcceptAsComplete;
		let shoudDeclineAsComplete;

		if (isAnsweredBySender) {
			if (isContractor) {
				shoudAcceptAsComplete = status === "CompleteRequested" || status === "CompleteDeclined";
				shoudDeclineAsComplete = status === "CompleteRequested";
			} else {
				const shouldRequestApproval = status_answered_by_sender !== "ApprovalRequested" && status_answered_by_sender !== "ApprovalAccepted";
				shoudMarkAsComplete = !shouldRequestApproval && (status !== "CompleteRequested" && status !== "CompleteAccepted");
			}
		} else {
			if (isContractor) {
				shoudMarkAsComplete = status !== "CompleteRequested" && status !== "CompleteAccepted";
			} else {
				shoudAcceptAsComplete = status === "CompleteRequested" || status === "CompleteDeclined";
				shoudDeclineAsComplete = status === "CompleteRequested";
			}
		}

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
				{shoudMarkAsComplete &&
					<NavItem status="CompleteRequested" onClick={this.onActionAsComplete} title="Mark As Complete"/>}
				{shoudAcceptAsComplete &&
					<NavItem status="CompleteAccepted" onClick={this.onActionAsComplete} title="Accept As Complete"/>}
				{shoudDeclineAsComplete &&
					<NavItem status="CompleteDeclined" onClick={this.onActionAsComplete} title="Decline As Complete"/>}
			</div>
		}).open();
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onRequestsOptions">
	onRequestsOptions(e, btn) {
		const {
			id, data: {
				status = "New", status_answered_by_sender, answered_by = 'Recipient',
			}
		} = this.item;

		const {isContractor} = storage.is;

		const isAnsweredBySender = answered_by === "Sender";

		let shouldRequestApproval;
		let shouldAcceptQuestionnaire;
		let shouldDeclineQuestionnaire;

		if (isAnsweredBySender) {
			if (isContractor) {
				shouldAcceptQuestionnaire = status_answered_by_sender === "ApprovalRequested" || status_answered_by_sender === "ApprovalDeclined";
				shouldDeclineQuestionnaire = status_answered_by_sender === "ApprovalRequested";
			} else {
				shouldRequestApproval = status_answered_by_sender !== "ApprovalRequested" && status_answered_by_sender !== "ApprovalAccepted";
			}
		} else {
			if (isContractor) {
				shouldAcceptQuestionnaire = status_answered_by_sender === "ApprovalRequested" || status_answered_by_sender === "ApprovalDeclined";
				shouldDeclineQuestionnaire = status_answered_by_sender === "ApprovalRequested";
			} else {
//                shouldRequestApproval = status_answered_by_sender !== "ApprovalRequested" && status_answered_by_sender !== "ApprovalAccepted";
			}
		}

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
				{shouldRequestApproval &&
					<NavItem status_answered_by_sender="ApprovalRequested" onClick={this.onActionQuestionnaire}
					         title="Request Approval"/>}
				{shouldAcceptQuestionnaire &&
					<NavItem status_answered_by_sender="ApprovalAccepted" onClick={this.onActionQuestionnaire}
					         title="Accept Questionnaire"/>}
				{shouldDeclineQuestionnaire &&
					<NavItem status_answered_by_sender="ApprovalDeclined" onClick={this.onActionQuestionnaire}
					         title="Decline Questionnaire"/>}
			</div>
		}).open();
	}

	// </editor-fold>

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
					status = "New",
					status_answered_by_sender,
					answered_by = 'Recipient',
					is_template,
					visibility,
					page_title_list,
					question_list,
					//
					total_questions,
					total_compliance,
					// total_questions,
					//
					contractor: {name: contractorName, username},
				}
			}
		} = this;
		console.log('item', item)

		return <FormControls lazyLoad>
			<Row
				rendered
				active
				idx={1}
				title="1. Compliance Summary"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
			>
				<div className="row margin-0 flex">
					<Stats value={total_questions} title='Total Questions'/>
					<Compliance value={100 - total_compliance} title='Non-Compliance' status={status}/>
					<Compliance value={total_compliance} title='Compliance' status={status}/>
				</div>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Contractor Questionnaire"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
			>
				<AnswerQuestions
					ref="questions"
					defaultType="Questions"
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
