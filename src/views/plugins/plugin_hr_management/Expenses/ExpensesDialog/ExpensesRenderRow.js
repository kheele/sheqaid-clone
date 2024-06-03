// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import {renderExpiryDateSpan} from 'utils/ComponentUtils';
import {Dates} from 'utils/Utils';
import {ActionsButton, UploadButton} from 'components/inputs';
import {TRow} from 'components/tables';
import ARenderRow from "../../AEmployeeDocDialog/ARenderRow";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends ARenderRow {
    listName = 'expense_list';
    
    @computed get isUnsubmitted() {
        return this.status === "Unsubmitted";
    }
    
    @computed get isAwaitingApproval() {
        return this.status === "Awaiting Approval";
    }
    
    @computed get isAwaitingPayment() {
        return this.status === "Awaiting Payment";
    }
    
    @computed get isCompleted() {
        return this.status === "Completed";
    }
    
    @computed get isRejected() {
        return this.status === "Rejected";
    }
    
    @computed get status() {
        const {status} = this.props;
        return status;
    }
    
    getRenderRowByEach() {
        const {item, idx, view, onAction, onClick, renderActionsCol} = this.props;
        const {isUnsubmitted, isAwaitingApproval, isAwaitingPayment, isCompleted, isRejected} = this;
        
        let {
            id,
            data: {
                created_at,
                doc, //
                employee: {lname, fname},
                category,
                currency_country,
                paid_with,
                date,
                amount,
                status,
                comments,
                date_submitted,
                date_approved,
                date_compensated,
            },
        } = item;
        
        const frag = <>
            <div className="td fixed-flex min-w-50">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Employee</h6>
                {lname + ' ' + fname}
            </div>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(date) || 'N/A'}</div>
            {isCompleted && <div className="td fixed-flex min-w-120">{Dates.formatDate(date_compensated) || 'N/A'}</div>}
            <div className="td fixed-flex min-w-140">{amount}</div>
            <div className="td fixed-flex min-w-200">{currency_country && currency_country.currency_name}</div>
            <div className="td fixed-flex min-w-160">{paid_with}</div>
            <div className="td">{category}</div>
            <div className="td fixed-flex min-w-260">
                <UploadButton
                  name="doc"
                  defaultValue={doc}
                  buttonTitle="Attachment"
                  type={['PDF', 'Image']}
                  showOnlyIcon
                  readonly
                  className="col-lg-6 pull-left-3"
                />
            </div>
            <div className="td fixed-flex min-w-140">{status}</div>
        </>;
        
        if (isUnsubmitted) {
            return <TRow key={id} className="w-full">
                {frag}
                <div className="td fixed-flex min-w-160">
                    <ActionsButton idx={idx} id={item.id} className="btn btn-primary pull-right min-w-40" text="Submit" status="Awaiting Approval" onClick={onAction}/>
                </div>
                {renderActionsCol && renderActionsCol(item, idx, onClick)}
                {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={idx} id={item.id} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>}
            </TRow>;
        }
        if (isAwaitingApproval) {
            return <TRow key={id} className="w-full">
                {frag}
                <div className="td fixed-flex min-w-160">
                    <ActionsButton idx={idx} id={item.id} className="btn btn-primary pull-right min-w-40" text="Approve" status="Awaiting Payment" onClick={onAction}/>
                    <ActionsButton idx={idx} id={item.id} className="btn btn-primary pull-right min-w-40" text="Reject" status="Rejected" onClick={onAction}/>
                </div>
                {renderActionsCol && renderActionsCol(item, idx, onClick)}
                {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={idx} id={item.id} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>}
            </TRow>;
        }
        if (isAwaitingPayment) {
            return <TRow key={id} className="w-full">
                {frag}
                <div className="td fixed-flex min-w-160">
                    <ActionsButton idx={idx} id={item.id} className="btn btn-primary pull-right min-w-40" text="Pay Out" status="Completed" onClick={onAction}/>
                </div>
                {renderActionsCol && renderActionsCol(item, idx, onClick)}
                {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={idx} id={item.id} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>}
            </TRow>;
        }
        if (isCompleted) {
            return <TRow key={id} className="w-full">
                {frag}
                {renderActionsCol && renderActionsCol(item, idx, onClick)}
                {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={idx} id={item.id} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>}
            </TRow>;
        }
        if (isRejected) {
            return <TRow key={id} className="w-full">
                {frag}
                {renderActionsCol && renderActionsCol(item, idx, onClick)}
                {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={idx} id={item.id} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>}
            </TRow>;
        }
        
        return null;
    }
}
// </editor-fold>

export default RenderRow;
