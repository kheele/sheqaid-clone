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
        const {employee: mainEmployee, item, idx, onRenderActionCell, onClick} = this.props;
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
                schedule_date,
                next_schedule_date,
                date_completed,
                responsible_person,
                responsible_department,
                //
                employee,
                employee_other,
                //
                template,
                team_observed,
                task_observed,
            }
        } = item;

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-60">{id}</div>
            {/*<div className="td fixed-flex min-w-140">/!*score*!/</div>*/}
            {!mainEmployee && <div
                className="td">{(employee || employee_other) && (employee || employee_other).full_name || 'N/A'}</div>}
            <div className="td">{responsible_person && responsible_person.full_name || 'N/A'}</div>
            <div className="td">{task_observed || 'N/A'}</div>
            <div className="td fixed-flex min-w-160">{interval}</div>
            <div className="td fixed-flex min-w-160">{Dates.formatDate(start_date)}</div>
            <div className="td fixed-flex min-w-160">{Dates.formatDate(schedule_date)}</div>
            <div className="td fixed-flex min-w-160">{Dates.formatDate(next_schedule_date)}</div>
            <div
                className="td fixed-flex min-w-160">{date_completed ? "Yes" : "No"/*Dates.formatDateTime(date_completed)*/}</div>
            {onRenderActionCell && onRenderActionCell(item, idx)}
            {!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

export default ObservationTableRow;
