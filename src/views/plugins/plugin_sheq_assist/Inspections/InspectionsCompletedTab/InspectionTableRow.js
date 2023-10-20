// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
import {AsyncTD} from 'views/plugins/components';
import {all_question_list} from "components/questionnaires/AResponseUtils";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="InspectionTableRow">
@observer
class InspectionTableRow extends React.Component {
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
                date_completed,
                time_completed,
                schedule_date,
                responsible_person,
                responsible_department,
                asset_type,
                asset,
                schedule_list = [],
                //
                template
            }
        } = item;

        const _schedule_date = Dates.parse(schedule_date);

        let nextSchedule;

        if (_schedule_date) {
            switch (interval) {
                case 'Daily': {
                    nextSchedule = _schedule_date.addDays(1);
                    break;
                }
                case 'Weekly': {
                    nextSchedule = _schedule_date.addWeeks(1);
                    break;
                }
                case 'Monthly': {
                    nextSchedule = _schedule_date.addMonths(1);
                    break;
                }
                case 'Quarterly': {
                    nextSchedule = _schedule_date.addMonths(3);
                    break;
                }
                case 'Bi-Annually': {
                    nextSchedule = _schedule_date.addMonths(6);
                    break;
                }
                case 'Annually': {
                    nextSchedule = _schedule_date.addYears(1);
                    break;
                }
            }
        }

        const getQuestions = async (question_list) => {
            return all_question_list(question_list);
        };

        const renderProgress = (v) => {
            const answerCount = v.filter(v => !!v.answer).length;
            const perc = (answerCount / v.length) * 100;
            const progress = perc.toFixed(1) + '% Complete';
            return progress;
        };

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-40">{id}</div>
            <div className="td">{name}</div>
            <div
                className="td fixed-flex min-w-140">{asset ? `${asset.asset_detail.name} (${asset.asset_detail.reg_num || asset.asset_detail.serial_num})` : 'N/A'}</div>
            <div className="td fixed-flex min-w-180">{responsible_person && responsible_person.full_name || 'N/A'}</div>
            <div className="td fixed-flex min-w-80">{interval}</div>
            <div className="td fixed-flex min-w-100">{Dates.formatDate(start_date)}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(schedule_date)}</div>
            <div className="td fixed-flex min-w-160">{Dates.formatDate(date_completed)} {time_completed}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(nextSchedule)}</div>
            <AsyncTD
                title="Progress"
                defaultValue={getQuestions(question_list)}
                renderer={renderProgress}
                className="td fixed-flex min-w-270 flex-center progress-bar"
            />
            {onRenderActionCell && onRenderActionCell(item, idx)}
            {!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

export default InspectionTableRow;
