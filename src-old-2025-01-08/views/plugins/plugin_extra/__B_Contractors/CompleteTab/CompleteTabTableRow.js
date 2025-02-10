// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
import {all_question_list} from "../../../../../components/questionnaires/AResponseUtils";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CompleteTabTableRow">
@observer
class CompleteTabTableRow extends React.Component {
	render() {
		const {item, idx, onRenderActionCell, onClick} = this.props;
		// const {id, data: {created_at, name, template: {name: template_name}, score, conducted, completed}} = item;
		const {
			id, data: {
				created_at,
				name: formName,
				desc,
				status,
				status_answered_by_sender,
				answered_by = 'Recipient',
				type,
				page_title_list,
				question_list,
				progress,
				total_questions,
				total_answered,
				total_unanswered,
				total_deviations,
				total_non_deviations,
				total_compliance,
				//
				date_completed,
				time_completed,
				//
				template
			}
		} = item;

		///////////////////////////////////////
		
// 		const calculate = (list) => {
// //            console.log('calculate', toJS(list))
// 			list = list.filter(({maxScore}) => isNumber(maxScore) && maxScore > 0);
// 			const score = list.map(({
// 				                        score,
// 				                        maxScore
// 			                        }) => ((score && isNumber(score)) ? parseInt(score) : 0)).reduce((n1, n2) => n1 + n2, 0);
// 			const maxScore = list.map(({
// 				                           score,
// 				                           maxScore
// 			                           }) => ((maxScore && isNumber(maxScore)) ? parseInt(maxScore) : 0)).reduce((n1, n2) => n1 + n2, 0);
// 			const perc = maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : 'N/A';
// 			console.log('calculate 2 - ', {score, maxScore, perc})
// 			return {compliance: perc, nonCompliance: perc === 'N/A' ? perc : 100 - perc};
// 		};
//
// 		const getQuestions = async (question_list) => {
// 			return all_question_list(question_list);
// 		};
//
// 		const color = (perc, isCompliance) => {
// 			if (perc === 'N/A') {
// 				return 'default';
// 			}
// 			if (perc >= 80) {
// 				return isCompliance ? "green" : "red";
// 			} else if (perc >= 50) {
// 				return "orange";
// 			} else {
// 				return isCompliance ? "red" : "green";
// 			}
// 		};
//
// 		const renderCompliance = (v) => {
// 			const {compliance} = calculate(v);
// 			return <span
// 				className={color(compliance, true)}>{compliance === 'N/A' ? compliance : `${compliance}%`}</span>;
// 		};
// 		const renderNonCompliance = (v) => {
// 			const {nonCompliance} = calculate(v);
// 			return <span
// 				className={color(nonCompliance)}>{nonCompliance === 'N/A' ? nonCompliance : `${nonCompliance}%`}</span>;
// 		};
// 		const renderProgress = (v) => {
// 			const answerCount = v.filter(v => !!v.answer).length;
// 			const perc = (answerCount / v.length) * 100;
// 			const progress = perc.toFixed(1) + '% Complete';
// 			return progress;
// 		};
//
		
		return <TRow key={id} className="w-full">
			<div className="td fixed-flex min-w-40">{id}</div>
			<div className="td">{formName}</div>
			<div className="td fixed-flex min-w-100">{total_questions}</div>
			<div className="td fixed-flex min-w-100">{total_answered}</div>
			<div className="td fixed-flex min-w-140">{total_deviations}</div>
			<div className="td fixed-flex min-w-120">{total_compliance}</div>
			<div className="td fixed-flex min-w-100">{status}</div>
			<div className="td fixed-flex min-w-270 flex-center progress-bar">{progress.toFixed(1) + '% Complete'}</div>
			{onRenderActionCell && onRenderActionCell(item, idx)}
			{!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>}
		</TRow>;
	}
}

// </editor-fold>

export default CompleteTabTableRow;
