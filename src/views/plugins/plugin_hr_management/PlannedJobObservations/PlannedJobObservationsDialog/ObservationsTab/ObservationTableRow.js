// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ObservationTableRow">
@observer
class ObservationTableRow extends React.Component {
	render() {
		const {item, idx, onRenderActionCell, onClick} = this.props;
		// const {id, data: {created_at, name, template: {name: template_name}, score, conducted, completed}} = item;
		const {
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
				responsible_person,
				responsible_department,
				//
				job_position,
				employee,
				//
				template
			}
		} = item;

		let nextSchedule;
		if(start_date) {
			switch (interval) {
				case 'Daily':
					nextSchedule = Dates.parse(start_date).addDays(1);
					break;
				case 'Weekly':
					nextSchedule = Dates.parse(start_date).addWeeks(1);
					break;
				case 'Monthly':
					nextSchedule = Dates.parse(start_date).addMonths(1);
					break;
				case 'Quarterly':
					nextSchedule = Dates.parse(start_date).addMonths(3);
					break;
				case 'Bi-Annually':
					nextSchedule = Dates.parse(start_date).addMonths(6);
					break;
				case 'Annually':
					nextSchedule = Dates.parse(start_date).addYears(1);
					break;
			}
		}

		return <TRow key={id} className="w-full">
			<div className="td fixed-flex min-w-40">{id}</div>
			{/*<div className="td">{name}</div>*/}
			{/*<div className="td">{template && template.name || 'N/A'}</div>*/}
			{/*<div className="td fixed-flex min-w-140">/!*score*!/</div>*/}
			<div className="td">{job_position ? job_position.name : 'Any'}</div>
			<div className="td">{employee && employee.full_name || 'N/A'}</div>
			<div className="td">{responsible_person && responsible_person.full_name || 'N/A'}</div>
			<div className="td fixed-flex min-w-160">{interval}</div>
			<div className="td fixed-flex min-w-160">{Dates.formatDate(start_date)}</div>
			<div className="td fixed-flex min-w-160">{Dates.formatDate(nextSchedule)}</div>
			<div className="td fixed-flex min-w-160">{/*Dates.formatDateTime(completed)*/}</div>
			{onRenderActionCell && onRenderActionCell(item, idx)}
			{!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>}
		</TRow>;
	}
}

// </editor-fold>

export default ObservationTableRow;
