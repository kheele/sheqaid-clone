// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
import {Dates} from "utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends React.Component {

    render() {
        const {item, idx, view, onClick, onView, renderActionsCol} = this.props;
        console.log(item)
        const {
            id,
            data: {
                leave_type,
                default_days_allowed,
                max_carryover_years,
                accrual_period_start,
                accrual_period_end,
            }
        } = item;
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-60">{id}</div>
            <div className="td">{leave_type.name}</div>
            <div className="td">{default_days_allowed}</div>
            <div className="td">{max_carryover_years}</div>
            <div className="td">{Dates.formatDate(accrual_period_start)}</div>
            <div className="td">{Dates.formatDate(accrual_period_end)}</div>
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }

}

// </editor-fold>

export default RenderRow;
