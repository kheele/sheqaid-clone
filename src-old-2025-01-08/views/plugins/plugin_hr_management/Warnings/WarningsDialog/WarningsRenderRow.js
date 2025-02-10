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
    listName = 'warning_list';

    getRenderRowByEach() {
        const {item, idx, view, onClick, renderActionsCol} = this.props;

        let {
            id,
            data: {
                created_at,
                issued_by,
                type,
                details,
                employee_comments,
                witness_list,

                date,
                expiry_date,
                expiry_updated,
                notes,
                doc,
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
            <div className="td">
                <h6 className="xs-shown font-size-13">Issued By</h6>
                {issued_by ? `${issued_by.full_name}` : 'N/A'}
            </div>
            <div className="td fixed-flex min-w-105">
                <h6 className="xs-shown font-size-13">Witnesses</h6>
                {witness_list ? witness_list.length || 'N/A' : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Warning Type</h6>
                {type || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Details</h6>
                {details || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-105">
                <h6 className="xs-shown font-size-13">Warning Date</h6>
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
