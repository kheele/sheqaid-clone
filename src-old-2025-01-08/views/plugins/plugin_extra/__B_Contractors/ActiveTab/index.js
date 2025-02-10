import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./ActiveTab.lazy.css";
import APageListReadWrite from "views/APageListReadWrite";
import ConfirmDialog from "components/dialogs/ConfirmDialog";

import {toJS} from "mobx";
import NavItem from "components/navs/NavItem";
import {
	ClearableInput,
	SelectQuestionnaireTemplateInput,
} from "components/inputs";
import {THead} from "components/tables";
import ActiveTabTableRow from "./ActiveTabTableRow";
import updateQuestionnaire from "mutations/all/Questionnaires/Questionnaires/updateQuestionnaire";

import ProfileQuestionnairePDFReader from "../printers/ProfileQuestionnairePDFReader";
import ProfileResponsePDFReader from "../printers/ProfileResponsePDFReader";
import NewDocTemplateDialog from "../forms/NewDocTemplateDialog";

import NewQuestionnaireDialog from "../forms/NewQuestionnaireDialog";
import EditQuestionnaireDialog from "../forms/EditQuestionnaireDialog";
import ProfileQuestionnaireDialog from "../forms/ProfileQuestionnaireDialog";
import EditResponseDialog from "../forms/EditResponseDialog";
import ProfileResponseDialog from "../forms/ProfileResponseDialog";
import {Dates} from "../../../../../utils/Dates";

@observer
class ActiveTab extends React.Component {
	pageKey = "ActiveTab";
	
	//<editor-fold desc="state">
	@observable
	state = {
		lists: {
			status: [
				{label: "New", value: "New", checked: false},
				{label: "Seen", value: "Seen", checked: false},
				{label: "Completion Requested", value: "CompleteRequested", checked: false},
				{label: "Completion Declined", value: "CompleteDeclined", checked: false},
				{label: "Complete", value: "CompleteAccepted", checked: false}
			]
		}
	};
	//</editor-fold>
	
	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);
		
		this.onLoadList = this.onLoadList.bind(this);
		
		this.onCopy = this.onCopy.bind(this);
		this.onSaveAsTemplate = this.onSaveAsTemplate.bind(this);
		
		this.onViewResponses = this.onViewResponses.bind(this);
		this.onEditResponses = this.onEditResponses.bind(this);
		
		this.onActionAsComplete = this.onActionAsComplete.bind(this);
		this.onActionQuestionnaire = this.onActionQuestionnaire.bind(this);
		
		this.onExport = this.onExport.bind(this);
		this.onSaveAs = this.onSaveAs.bind(this);
		this.onRemoved = this.onRemoved.bind(this)

//        this.renderLeftButtons = this.renderLeftButtons.bind(this);
		this.renderTHead = this.renderTHead.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
		this.renderFilterNode = this.renderFilterNode.bind(this);
	}
	
	//</editor-fold>
	
	//<editor-fold desc="mounts">
	componentWillMount() {
		style.use();
	}
	
	componentDidMount() {
		const {status} = this;
		
		const limit = 0;
		
		const args = {
			status,
			//
			limit,
			//
			exact_orgs: true,
		};
		
		// byLogged(args)/*.then((res) => {
		//    console.log(`questionnaires/onUpdate`, res)
		//     const {list} = this.refs.root;
		//     // questionnairesOnUpdate(list, {updateVal, data});
		// })*/;

//         this.onPromise = neonBinding.events.on(`${this.props.path}questionnaires/onUpdate`, ({updateVal, data}) => {
// //            console.log(`${this.props.path}questionnaires/onUpdate`, updateVal, data)
//             const {list} = this.refs.root;
//             questionnairesOnUpdate(list, {updateVal, data});
//         });
	}
	
	componentWillUnmount() {
		style.unuse();
		// neonBinding.events.off(`${this.props.path}questionnaires/onUpdate`, this.onPromise);
	}
	
	//</editor-fold>
	
	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			name,
			status,
			template_id,
		} = filterData || {};
		
		const listByLogged = sockets.of('contractors/questionnaires').fn('listActiveByLogged');
		
		return listByLogged({
			name,
			status,
			template_id,
			//
			exact_orgs: true,
			//
			offset: isNew ? 0 : this.refs.root.list.length,
		}).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}
	
	//</editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="actions">
	onViewResponses(evt, el) {
		const {idx} = el.props;
		const item = this.refs.root.list[idx];
		this.refs.responseDialog.open(item);
	}
	
	onEditResponses(evt, el) {
		const {idx} = el.props;
		const item = this.refs.root.list[idx];
		this.refs.responseEditDialog.open(item);
	}
	
	onCopy(evt, elem) {
		const {idx, action} = elem.props;
		const {list, onNew} = this.refs.root;
		const copy = toJS(list[idx]);
		onNew(evt, elem, copy);
	}
	
	onSaveAsTemplate(evt, elem) {
		const {idx, action} = elem.props;
		const {list, onNew} = this.refs.root;
		const copy = toJS(list[idx]);
		copy.data.status = "New";
		this.refs.newTemplateDialog.open(copy);
	}
	
	onActionAsComplete(evt, el) {
		const {status} = el.props;
		const d = new Date();
		this.onUpdateImpl(el, {
			status,
			date_completed: Dates.formatDateSQL(d),
			time_completed: Dates.formatTime(d),
		});
	}
	
	onActionQuestionnaire(evt, el) {
		const {status_answered_by_sender} = el.props;
		this.onUpdateImpl(el, {status_answered_by_sender});
	}
	
	onUpdateImpl(el, attrs) {
		return confirmDialog.open("Are you sure you want to confirm this action?").then(res => {
			if (res === 1) {
				const {idx} = el.props;
				const item = this.refs.root.list[idx];
				
				progressDialog.open("Please wait...");
				return updateQuestionnaire({id: item.id, ...attrs}).then(res => {
					if (res && attrs.status === 'CompleteAccepted') {
						this.refs.root.list.removeIf((val, n) => n === idx);
					}
					
					console.log("res", res)
					extendObservable(item.data, attrs);
					infoDialog.open("Record successfully updated.");
					infoDialog.close(2000);
					return true;
				}).finally(() => {
					progressDialog.close();
				});
			}
		});
	}
	
	onExport(e, el) {
		const {idx, type, title} = el.props;
		const item = this.refs.root.list[idx];
		popover.settings({
			style: {width: 'auto', minWidth: 200},
			isDialog: true,
			contentNode: <div>
				<p className="padding-t-10 text-center">{title}</p>
				<hr className="margin-t-0 margin-b-0"/>
				<NavItem idx={idx} type='PDF' refName={`profile${type}PDFReader`} onClick={this.onSaveAs} title='Save As PDF'/>
				<NavItem idx={idx} type='Excel' onClick={this.onSaveAs} title='Save As Spreadsheet'/>
			</div>
		}).open();
	}
	
	async onSaveAs(e, el) {
		const {idx, type, refName} = el.props;
		const item = this.refs.root.list[idx];
		const {[refName]: dialog} = this.refs;
		if (type === 'PDF') {
			dialog.open(item);
		} else if (type === 'Excel') {
		
		}
	}
	
	onRemoved(item) {
		this.refs.root.list.removeIf((v, n) => v.id === item.id);
	}
	
	// </editor-fold>
	
	// <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
		const item = this.refs.root.list[idx];
		const {
			id, data: {
				status, status_answered_by_sender, answered_by = 'Recipient',
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
//            alert(`isContractor=${isContractor}`)
//            alert(`shoudMarkAsComplete=${shoudMarkAsComplete}`)
		}
		
		const renderResponses = (isAnsweredBySender, isContractor) => {
			if (isAnsweredBySender) {
				if (isContractor) {
					return <NavItem onClick={this.onViewResponses} faIconLeft="eye" title="Responses"/>;
				} else {
					if (status_answered_by_sender === "ApprovalAccepted") {
						return <NavItem action="writable" onClick={this.onEditResponses} faIconLeft="edit" title="Responses"/>;
					}
					return <NavItem onClick={this.onViewResponses} faIconLeft="eye" title="Responses"/>;
				}
			} else {
				if (isContractor) {
					return <NavItem action="writable" onClick={this.onEditResponses} faIconLeft="edit" title="Responses"/>;
				} else {
					return <NavItem onClick={this.onViewResponses} faIconLeft="eye" title="Responses"/>;
				}
			}
		};
		
		const permissionKey = !isContractor && "Contractor Documents";
		return <Options idx={idx} permissionOtherKey={permissionKey} readonly={isContractor} override>
			{(!isContractor || isAnsweredBySender) && <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>}
			{!isContractor && <NavItem action="edit" override onClick={onEdit} faIconLeft="edit" title="Edit"/>}
			{!isContractor && <NavItem action="remove" override onClick={onRemove} faIconLeft="ban" title="Remove"/>}
			{!isContractor && <hr/>}
			{isContractor && !isAnsweredBySender &&
				<NavItem action="writable" onClick={this.onViewResponses} faIconLeft="eye" title="View"/>}
			{renderResponses(isAnsweredBySender, isContractor)}
			
			{(shoudMarkAsComplete || shoudAcceptAsComplete || shoudDeclineAsComplete) && <hr action="writable"/>}
			{shoudMarkAsComplete &&
				<NavItem action="writable" status="CompleteRequested" onClick={this.onActionAsComplete} faIconLeft="check"
				         title="Mark As Complete"/>}
			{shoudAcceptAsComplete && <NavItem status="CompleteAccepted" onClick={this.onActionAsComplete} faIconLeft="check"
			                                   title="Accept As Complete"/>}
			{shoudDeclineAsComplete && <NavItem status="CompleteDeclined" onClick={this.onActionAsComplete} faIconLeft="close"
			                                    title="Decline As Complete"/>}
			
			{(shouldRequestApproval || shouldAcceptQuestionnaire || shouldDeclineQuestionnaire) && <hr action="writable"/>}
			{shouldRequestApproval &&
				<NavItem status_answered_by_sender="ApprovalRequested" onClick={this.onActionQuestionnaire} faIconLeft="check"
				         title="Request Approval"/>}
			{shouldAcceptQuestionnaire &&
				<NavItem status_answered_by_sender="ApprovalAccepted" onClick={this.onActionQuestionnaire} faIconLeft="check"
				         title="Accept Questionnaire"/>}
			{shouldDeclineQuestionnaire &&
				<NavItem status_answered_by_sender="ApprovalDeclined" onClick={this.onActionQuestionnaire} faIconLeft="close"
				         title="Decline Questionnaire"/>}
			
			{!isContractor && <hr action="writable"/>}
			{!isContractor && <NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>}
			{/*<NavItem action="writable" idx={idx} onClick={this.onSaveAsTemplate} faIconLeft="copy" title="Save As Template"/>*/}
			{/*<hr action="writable"/>*/}
			{/*<NavItem action="writable" idx={idx} type="Questionnaire" onClick={this.onExport} faIconLeft="file-pdf-o" title="Export Questionnaire"/>*/}
			{/*<NavItem action="writable" idx={idx} type="Response" onClick={this.onExport} faIconLeft="file-pdf-o" title="Export Responses"/>*/}
		</Options>;
	}
	
	// </editor-fold>
	
	//<editor-fold desc="renderFilterNode">
	renderFilterNode(onChange) {
		const listByLogged = sockets.of('contractors/library').fn('listByLogged');
		
		return <div className="col-lg-12 controls flex">
			<ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
			<SelectQuestionnaireTemplateInput
				name="template"
				placeholder="Questionnaire Library..."
				className="form-control"
				byLogged={listByLogged}
				onChange={onChange}
			/>
			<ClearableInput name="status" type="select" placeholder="Status..." className="fixed-flex min-w-300 form-control"
			                onChange={onChange} values={this.state.lists.status} returnValue/>
		</div>;
	}
	
	//</editor-fold>
	
	//<editor-fold desc="renderTHead">
	renderTHead() {
		return <THead>
			<div className="td fixed-flex min-w-40">ID</div>
			<div className="td">Questionnaire</div>
			<div className="td fixed-flex min-w-100">Questions</div>
			<div className="td fixed-flex min-w-100">Responses</div>
			<div className="td fixed-flex min-w-200">Status</div>
			<div className="td fixed-flex min-w-270">Progress</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	
	//</editor-fold>
	
	//<editor-fold desc="renderItem">
	renderItem(n, onClick) {
		let item = this.refs.root.list[n];
		return <ActiveTabTableRow key={item.id} idx={n} item={item} onClick={onClick}/>;
	}
	
	//</editor-fold>
	
	render() {
		return <APageListReadWrite
			hasBackBtn={false}
			ref="root"
			page={this}
			hasCreateBtn={() => !storage.is.isContractor}
			forceCreate={!storage.is.isContractor}
			createBtnTitle="Create"
			pageId={this.pageKey + "-tab"}
			pageTitle="Questionnaires"
			pageTitleSingular="questionnaire"
			onLoadList={this.onLoadList}
			noAnimation={true}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
			<ConfirmDialog ref="removeDialog"/>
			
			<NewQuestionnaireDialog ref="newDialog"/>
			<EditQuestionnaireDialog ref="editDialog"/>
			<ProfileQuestionnaireDialog ref="profileDialog"/>
			
			<NewDocTemplateDialog ref="newTemplateDialog"/>
			
			<ProfileResponseDialog ref="responseDialog"/>
			<EditResponseDialog ref="responseEditDialog"/>
			
			<ProfileQuestionnairePDFReader ref="profileQuestionnairePDFReader"/>
			<ProfileResponsePDFReader ref="profileResponsePDFReader"/>
		</APageListReadWrite>;
	}
}

export default ActiveTab;
