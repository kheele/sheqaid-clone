// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
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
                name,
                desc,
                days_allocated_aggregate,
                days_used_aggregate,
                days_accrued_aggregate,
                days_carried_over_aggregate,
            }
        } = item;
        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-60">{id}</div>
            <div className="td">{name}</div>
            <div className="td">{desc}</div>
            <div
                className="td fixed-flex min-w-130">{days_allocated_aggregate.aggregate.sum.days_carried_over || 0}</div>
            <div className="td fixed-flex min-w-100">{days_used_aggregate.aggregate.sum.days_used_aggregate || 0}</div>
            <div
                className="td fixed-flex min-w-150">{days_accrued_aggregate.aggregate.sum.days_accrued_aggregate || 0}</div>
            <div
                className="td fixed-flex min-w-120">{days_carried_over_aggregate.aggregate.sum.days_carried_over_aggregate || 0}</div>
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }

}

// </editor-fold>

export default RenderRow;
