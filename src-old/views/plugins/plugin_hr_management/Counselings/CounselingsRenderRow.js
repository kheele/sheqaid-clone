// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ExpiryButtons, renderExpiryDateSpan} from '../../../../utils/ComponentUtils';
import {Dates} from '../../../../utils/Utils';
import {ActionsButton} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CounselingsRenderRow">
@observer
class CounselingsRenderRow extends React.Component {
    
    render() {
        const {item, idx, onClick, renderActionsCol} = this.props;
        console.log('CounselingsRenderRow', item)
        if(item.data.lname) {
            let {
                id, 
                data: {
                    fname, lname, 
                    optional_info, client, project, site, client_id, project_id, site_id,

                    docs: {
                        competency_list: {
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
                    <div className="td fixed-flex min-w-120 font-size-12">Responsible Person</div>
                    <div className="td fixed-flex min-w-120 font-size-12">Counseling Types</div>
                    <div className="td fixed-flex min-w-120 font-size-12">Reasons For Counseling</div>
                    <div className="td fixed-flex min-w-105 font-size-12">Completion Date</div>
                    <div className={"td fixed-flex padding-l-0 padding-r-0 min-w-" + (renderActionsCol ? 70: 60)}></div>
                </THead>
            </React.Fragment>;
        } else {
            let {
                id,
                data: {
                    created_at, 
                    employee, 
                    responsible_person,
                    //2
                    types,
                    reasons,
                    incident_desc,
                    corrective_actions,
                    counselling_hrs_to_complete,
                    expiry_date,
                    witness_list,
                    //3
                    doc
                }
            } = item;
            
            const responsible_person_name = (v) => {
                if(!v) return 'N/A';
                const {id, lname, fname, data} = v;
                return (lname || data.lname) + ' ' + (fname || data.fname);
            };
            
            return <TRow key={id} className="w-full-calc-subtract-10">
                <div className="td fixed-flex min-w-120 md-hidden">
                    <h6 className="xs-shown font-size-13">Date Created</h6>
                    {Dates.formatDate(created_at)}
                </div>
                <div className="td fixed-flex min-w-120">
                    <h6 className="xs-shown font-size-13">Responsible Person</h6>
                    {responsible_person_name(responsible_person) || 'N/A'}
                </div>
                <div className="td fixed-flex min-w-120">
                    <h6 className="xs-shown font-size-13">Counseling Types</h6>
                    {types ? types.map(v => <span>{v}</span>) : 'N/A'}
                </div>
                <div className="td fixed-flex min-w-120">
                    <h6 className="xs-shown font-size-13">Reasons For Counseling</h6>
                    {reasons ? reasons.map(v => <span>{v}</span>) : 'N/A'}
                </div>
                <div className="td fixed-flex min-w-105">
                    <h6 className="xs-shown font-size-13">Completion Date</h6>
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

export default CounselingsRenderRow;
