// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {renderExpiryDateSpan} from 'utils/ComponentUtils';
import {Dates} from 'utils/Utils';
import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
import ARenderRow from "../../AEmployeeDocDialog/ARenderRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends ARenderRow {
    listName = 'leave_list';

    getRenderRowByEach() {
        const {item, idx, view, onClick, renderActionsCol} = this.props;

        let {
            id,
            data: {
                created_at,
                due_to,
                days_booked,
                reason,
                employee_comments,
                notes,
                type,
                doc,
                date,
                expiry_date,
                expiry_updated,
                employee: {lname, fname},
            },
        } = item;

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-50">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Employee</h6>
                {lname + ' ' + fname}
            </div>
            <div className="td fixed-flex min-w-180">
                <h6 className="xs-shown font-size-13">Leave Type</h6>
                {type || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-160">
                <h6 className="xs-shown font-size-13">Leave Due To</h6>
                {due_to || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Reason Of Leave</h6>
                {reason}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Days Booked</h6>
                {days_booked || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-105">
                <h6 className="xs-shown font-size-13">Start Date</h6>
                {Dates.formatDate(date) || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-105">
                <h6 className="xs-shown font-size-13">Expiry Date</h6>
                {renderExpiryDateSpan(expiry_date)}
            </div>
            {renderActionsCol && renderActionsCol(item, idx, onClick)}
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}
// </editor-fold>

export default RenderRow;
