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
    listName = 'contract_list';

    getRenderRowByEach() {
        const {item, idx, view, onClick, renderActionsCol} = this.props;

        const {
            id,
            data: {
                created_at,
                salary_info = [],
                contract_details = [],
                doc,
                job_profile_doc,
                employee: {lname, fname},
            }
        } = item;

        const {
            contract_type,
            daily_working_hours,
            start_date,
            end_of_trial_period,
            expiry_date,
            start_time,
            end_time,
            notes,
        } = contract_details[0] || {};

        let {
            deductible_list, // [{id, created_at, text, value,}]
            payment_type,
            salary,
            salary_interval,
            wage,
        } = salary_info[0] || [];

        if (isNumber(salary)) {
            salary = salary.toCurrency('R');
        }

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
                <h6 className="xs-shown font-size-13">Contract Type</h6>
                {contract_type || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Payment Type</h6>
                {payment_type || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-140">
                <h6 className="xs-shown font-size-13">Salary Interval</h6>
                {salary_interval || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-150">
                <h6 className="xs-shown font-size-13">Time Range</h6>
                {start_time || 'N/A'} - {end_time || 'N/A'}
            </div>
            <div className="td fixed-flex min-w-140">
                <h6 className="xs-shown font-size-13">Working Hours</h6>
                {daily_working_hours || "N/A"}
            </div>
            <div className="td fixed-flex min-w-105">
                <h6 className="xs-shown font-size-13">Start Date</h6>
                {Dates.formatDate(start_date) || 'N/A'}
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
