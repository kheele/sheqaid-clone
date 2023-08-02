// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ExpiryButtons, renderExpiryDateSpan} from '../../../../utils/ComponentUtils';
import {Dates} from '../../../../utils/Utils';
import {ActionsButton} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="LeavesRenderRow">
@observer
class LeavesRenderRow extends React.Component {
    
    render() {
        const {item, idx, onClick, renderActionsCol} = this.props;
        console.log('LeavesRenderRow', item)
        if(item.data.lname) {
            let {
                id, 
                data: {
                    fname, lname, 
                    optional_info, client, project, site, client_id, project_id, site_id,

                    docs: {
                        leave_list: {
                            keys, ids, ids_by_expiry, latest
                        }
                    }
                }
            } = item;
            return <React.Fragment>
                <TRow key={id} className="w-full tr-header">
                    <div className="td">{lname + ' ' + fname}</div>
                    <div className="td fixed-flex min-w-105">{latest && renderExpiryDateSpan(latest.expiry_date)}</div>
                    <div className="td fixed-flex flex grid-gap-5 min-w-240">
                        <ExpiryButtons ids={ids} ids_by_expiry={ids_by_expiry}/>
                    </div>
                    {renderActionsCol && renderActionsCol(item, idx, onClick)}
                    {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                        <ActionsButton idx={idx} isEmployee className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                    </div>}
                </TRow>
                <THead key={`${id}-header`}>
                    <div className="td fixed-flex min-w-120 font-size-12 md-hidden">Date Created</div>
                    <div className="td fixed-flex min-w-120 font-size-12">Leave Type</div>
                    <div className="td fixed-flex min-w-120 font-size-12">Leave Due To</div>
                    <div className="td font-size-12">Reason Of Leave</div>
                    <div className="td fixed-flex min-w-120 font-size-12">Days Booked</div>
                    <div className="td fixed-flex min-w-105 font-size-12">Start Date</div>
                    <div className="td fixed-flex min-w-105 font-size-12">Expiry Date</div>
                    <div className={"td fixed-flex padding-l-0 padding-r-0 min-w-" + (renderActionsCol ? 70: 60)}></div>
                </THead>
            </React.Fragment>;
        } else {
            let {
                id,
                data: {
                    created_at, doc, employee, type, due_to, date, expiry_date, days_booked, reason, employee_comments, notes
                }
            } = item;
            
            return <TRow key={id} className="w-full-calc-subtract-10">
                <div className="td fixed-flex min-w-120 md-hidden">
                    <h6 className="xs-shown font-size-13">Date Created</h6>
                    {Dates.formatDate(created_at)}
                </div>
                <div className="td fixed-flex min-w-120">
                    <h6 className="xs-shown font-size-13">Leave Type</h6>
                    {type || 'N/A'}
                </div>
                <div className="td fixed-flex min-w-120">
                    <h6 className="xs-shown font-size-13">Leave Due To</h6>
                    {due_to || 'N/A'}
                </div>
                <div className="td">
                    <h6 className="xs-shown font-size-13">Reason Of Leave</h6>
                    {reason || "N/A"}
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
}
// </editor-fold>

export default LeavesRenderRow;
