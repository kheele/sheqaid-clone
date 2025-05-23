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
                employee,
                leave_type,
                days_allocated,
                days_used,
                days_carried_over,
                days_accrued,
                last_accrual_date,
                carryover_expiry_date,
                year,
            }
        } = item;
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-60">{id}</div>
            <div className="td">{employee.full_name}</div>
            <div className="td fixed-flex min-w-130">{leave_type.name}</div>
            <div className="td fixed-flex min-w-80">{year}</div>
            <div className="td fixed-flex min-w-130">{days_allocated}</div>
            <div className="td fixed-flex min-w-100">{days_used}</div>
            <div className="td fixed-flex min-w-150">{days_carried_over}</div>
            <div className="td fixed-flex min-w-120">{days_accrued}</div>
            <div className="td fixed-flex min-w-140">{Dates.formatDate(last_accrual_date)}</div>
            <div className="td fixed-flex min-w-180">{Dates.formatDate(carryover_expiry_date)}</div>
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }

}

// </editor-fold>

export default RenderRow;
