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
    listName = 'competency_list';

    getRenderRowByEach() {
        const {item, idx, view, onClick, renderActionsCol} = this.props;

        let {
            id,
            data: {
                created_at,
                accreditation_num,
                certificate_num,
                competency_type,
                type,
                doc,
                issued_date,
                expiry_date,
                expiry_updated,
                employee: {lname, fname},
                training = {},
            },
        } = item;

        const {course} = training || {};

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-50">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Employee</h6>
                {lname + ' ' + fname}
            </div>
            <div className="td fixed-flex min-w-140">
                <h6 className="xs-shown font-size-13">Accreditation No.</h6>
                {accreditation_num || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-140">
                <h6 className="xs-shown font-size-13">Certificate No.</h6>
                {certificate_num || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Certificate Type</h6>
                {type || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-160">
                <h6 className="xs-shown font-size-13">Competency Type</h6>
                {competency_type || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Course</h6>
                {course && course.name || "N/A"}
            </div>
            <div className="td fixed-flex min-w-105">
                <h6 className="xs-shown font-size-13">Issued Date</h6>
                {Dates.formatDate(issued_date) || 'N/A'}
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