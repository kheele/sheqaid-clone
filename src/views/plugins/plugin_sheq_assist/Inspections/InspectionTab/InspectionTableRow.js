// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
import {AsyncTD} from "../../../components";
import {all_question_list} from "../../../../../components/questionnaires/AResponseUtils";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="InspectionTableRow">
@observer
class InspectionTableRow extends React.Component {
    render() {
        const {asset: mainAsset, item, idx, onRenderActionCell, isUpcoming, unanswered, onClick} = this.props;
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
                progress,
                total_questions,
                //
                interval,
                start_date,
                date_completed,
                time_completed,
                schedule_date,
                next_schedule_date,
                responsible_employee_list,
                responsible_person_other_list,
                responsible_user,
                responsible_department,
                asset_type,
                asset,
                schedule_list = [],
                //
                template
            }
        } = item;

        const responsible_person_list = [
            ...(responsible_employee_list || []),
            ...(responsible_person_other_list || []),
        ];

        // const getQuestions = async (question_list) => {
        //     return all_question_list(question_list);
        // };
        //
        // const renderProgress = (v) => {
        //     //expiry, hasResponseAttachment, responseAttachmentRequired, responseAttachment, options{answer}
        //     const answerCount = v.filter(v => !!v.answer).length;
        //     const perc = (answerCount / v.length) * 100;
        //     const progress = perc.toFixed(1) + '% Complete';
        //     return progress;
        // };

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-40">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Name</h6>
                {name}
            </div>
            {/*<div className="td fixed-flex min-w-140">/!*score*!/</div>*/}
            {!mainAsset && <div className="td fixed-flex min-w-140">
                <h6 className="xs-shown font-size-13">Asset Type</h6>
                {asset_type || 'N/A'}
            </div>}
            {!mainAsset && <div
              className="td fixed-flex min-w-140">
                <h6 className="xs-shown font-size-13">Asset</h6>
                {asset ? `${asset.asset_detail.name} (${asset.asset_detail.reg_num || asset.asset_detail.serial_num})` : 'N/A'}
            </div>}
            <div className="td fixed-flex min-w-180">
                <h6 className="xs-shown font-size-13">Responsible Person(s)</h6>
                {responsible_person_list && responsible_person_list.map(v => v.full_name).join(', ') || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-80">
                <h6 className="xs-shown font-size-13">Interval</h6>
                {interval || "N/A"}
            </div>
            {/* <div className="td fixed-flex min-w-100">
                <h6 className="xs-shown font-size-13">Start Date</h6>
                {Dates.formatDate(start_date) || "N/A"}
            </div> */}
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Date Scheduled</h6>
                {Dates.formatDate(schedule_date) || "N/A"}
            </div>
            {!isUpcoming && <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Next Schedule</h6>
                {Dates.formatDate(next_schedule_date) || "N/A"}
            </div>}
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Questions</h6>
                {total_questions}
            </div>
            {!isUpcoming && !unanswered && <div className="td fixed-flex min-w-200 flex-center progress-bar">
                {progress.toFixed(1) + '% Complete'}
            </div>}
            {onRenderActionCell && onRenderActionCell(item, idx)}
            {!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

export default InspectionTableRow;
