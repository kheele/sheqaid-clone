// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ExpiryButtons, renderExpiryDateSpan} from '../../../../utils/ComponentUtils';
import {Dates} from '../../../../utils/Utils';
import {ActionsButton} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="WarningsRenderRow">
@observer
class WarningsRenderRow extends React.Component {
    
    render() {
        const {item, idx, onClick, renderActionsCol} = this.props;
        console.log('WarningsRenderRow', item)
        if(item.data.lname) {
            let {
                id, 
                data: {
                    fname, lname, 
                    optional_info, client, project, site, client_id, project_id, site_id,

                    docs: {
                        warning_list: {
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
                    <div className="td fixed-flex min-w-120 font-size-12">Warning Type</div>
                    <div className="td font-size-12">Issued By</div>
                    <div className="td fixed-flex min-w-120 font-size-12">Witnesses</div>
                    <div className="td fixed-flex min-w-105 font-size-12">Warning Date</div>
                    <div className="td fixed-flex min-w-105 font-size-12">Expiry Date</div>
                    <div className={"td fixed-flex padding-l-0 padding-r-0 min-w-" + (renderActionsCol ? 70: 60)}></div>
                </THead>
            </React.Fragment>;
        } else {
            let {
                id,
                data: {
                    created_at, issued_by, type, date, expiry_date, details, employee_comments, notes, witness_list, doc
                }
            } = item;
            
            return <TRow key={id} className="w-full-calc-subtract-10">
                <div className="td fixed-flex min-w-120 md-hidden">
                    <h6 className="xs-shown font-size-13">Date Created</h6>
                    {Dates.formatDate(created_at)}
                </div>
                <div className="td fixed-flex min-w-120">
                    <h6 className="xs-shown font-size-13">Warning Type</h6>
                    {type || 'N/A'}
                </div>
                <div className="td">
                    <h6 className="xs-shown font-size-13">Issued By</h6>
                    {issued_by ? (issued_by.lname || issued_by.fname) : "N/A"}
                </div>
                <div className="td fixed-flex min-w-120">
                    <h6 className="xs-shown font-size-13">Witnesses</h6>
                    {witness_list ? witness_list.length : 'N/A'}
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
}
// </editor-fold>

export default WarningsRenderRow;
