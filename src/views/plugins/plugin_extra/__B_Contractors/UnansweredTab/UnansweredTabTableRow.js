// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="UnansweredTabTableRow">
@observer
class UnansweredTabTableRow extends React.Component {
	render() {
		const {item, idx, onRenderActionCell, onClick} = this.props;
		// const {id, data: {created_at, name, template: {name: template_name}, score, conducted, completed}} = item;
		const {
			id, data: {
				created_at,
				name: formName,
				desc,
				status = "New",
				status_answered_by_sender,
				answered_by = 'Recipient',
				type,
				page_title_list,
				question_list,
				progress,
				total_questions,
				total_answered,
				//
				date_completed,
				time_completed,
				//
				template
			}
		} = item;

		//inspection
		// let statusView;
		//
		// if (status === 'CompleteRequested' || status === 'CompleteAccepted' || status === 'CompleteDeclined') {
		// 	switch (status) {
		// 		case "New":
		// 		case "Seen":
		// 			statusView = status;
		// 			break;
		// 		case "CompleteRequested":
		// 			statusView = "Completion Requested";
		// 			break;
		// 		case "CompleteAccepted":
		// 			//not allowed in this page
		// 			break;
		// 		case "CompleteDeclined":
		// 			statusView = "Completion Declined";
		// 			break;
		// 	}
		// } else {
		// 	if (status_answered_by_sender === 'ApprovalRequested') {
		// 		statusView = 'Awaiting Request Approval';
		// 	} else if (status_answered_by_sender === 'ApprovalDeclined') {
		// 		statusView = 'Request Declined';
		// 	} else if (status_answered_by_sender === 'ApprovalAccepted') {
		// 		statusView = 'Approval Accepted';
		// 	}
		// }
		
		////////////////////////////////////////contractor
		
		const isAnsweredBySender = answered_by === "Sender";
		
		let statusView;
		
		if (isAnsweredBySender) {
			if (!status_answered_by_sender) {
				statusView = 'Awaiting Approval Request';
			} else {
				if (status === 'CompleteRequested' || status === 'CompleteAccepted' || status === 'CompleteDeclined') {
					switch (status) {
						case "New":
						case "Seen":
							statusView = status;
							break;
						case "CompleteRequested":
							statusView = "Completion Requested";
							break;
						case "CompleteAccepted":
							//not allowed in this page
							break;
						case "CompleteDeclined":
							statusView = "Completion Declined";
							break;
					}
				} else {
					if (status_answered_by_sender === 'ApprovalRequested') {
						statusView = 'Awaiting Request Approval';
					} else if (status_answered_by_sender === 'ApprovalDeclined') {
						statusView = 'Request Declined';
					} else if (status_answered_by_sender === 'ApprovalAccepted') {
						statusView = 'Approval Accepted';
					}
				}
			}
		} else {
			switch (status) {
				case "New":
				case "Seen":
					statusView = status;
					break;
				case "CompleteRequested":
					statusView = "Completion Requested";
					break;
				case "CompleteAccepted":
					//not allowed in this page
					break;
				case "CompleteDeclined":
					statusView = "Completion Declined";
					break;
			}
		}
		
		///////////////////////////////////////

		// const getQuestions = async (question_list) => {
		// 	return all_question_list(question_list);
		// };
		//
		// const renderProgress = (v) => {
		// 	//expiry, hasResponseAttachment, responseAttachmentRequired, responseAttachment, options{answer}
		// 	const answerCount = v.filter(v => !!v.answer || !!v.answer_employee || !!v.answer_asset).length;
		// 	const perc = (answerCount / v.length) * 100;
		// 	const progress = perc.toFixed(1) + '% Complete';
		// 	return progress;
		// };

		return <TRow key={id} className="w-full">
			<div className="td fixed-flex min-w-40">{id}</div>
			<div className="td">{formName}</div>
			<div className="td fixed-flex min-w-100">{total_questions}</div>
			<div className="td fixed-flex min-w-100">{total_answered}</div>
			<div className="td fixed-flex min-w-200">{statusView}</div>
			<div className="td fixed-flex min-w-270 flex-center progress-bar">{progress.toFixed(1) + '% Complete'}</div>
			{onRenderActionCell && onRenderActionCell(item, idx)}
			{!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>}
		</TRow>;
	}
}

// </editor-fold>

export default UnansweredTabTableRow;
