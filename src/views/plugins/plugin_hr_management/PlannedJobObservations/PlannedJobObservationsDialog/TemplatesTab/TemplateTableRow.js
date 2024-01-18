// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
import {all_question_list} from "components/questionnaires/AResponseUtils";
import {AsyncTD} from "../../../../components";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="TemplateTableRow">
@observer
class TemplateTableRow extends React.Component {
    render() {
        const {item, idx, onRenderActionCell, onClick} = this.props;
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
                total_questions,
              //
                template_questionnaire_list_aggregate,
                job_position
            }
        } = item;
//        console.log('form', item)

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-40">{id}</div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{job_position && job_position.name || "Any"}</div>
            <div className="td">{name}</div>
            <div className="td">{desc || 'N/A'}</div>
            <div className="td fixed-flex min-w-180">{template_questionnaire_list_aggregate.aggregate.count}</div>
            <div className="td fixed-flex min-w-100">{total_questions}</div>
            <div className="td fixed-flex min-w-80">{visibility}</div>
            <div className="td fixed-flex min-w-80">{scheduled ? "Yes" : "No"}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
}
// </editor-fold>

export default TemplateTableRow;
