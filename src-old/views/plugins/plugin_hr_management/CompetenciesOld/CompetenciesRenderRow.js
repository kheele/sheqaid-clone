// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ExpiryButtons, renderExpiryDateSpan} from '../../../../utils/ComponentUtils';
import {Dates} from '../../../../utils/Utils';
import {ActionsButton} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends React.Component {
    
    render() {
        const {item, idx, onClick, renderActionsCol} = this.props;
        console.log('CompetenciesRenderRow', item)
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
                    <div className="td fixed-flex min-w-140 font-size-12">Accreditation No.</div>
                    <div className="td fixed-flex min-w-120 font-size-12">Certificate Type</div>
                    <div className="td fixed-flex min-w-160 font-size-12">Competency Type</div>
                    <div className="td fixed-flex min-w-140 font-size-12">Training Type</div>
                    <div className="td font-size-12">Course</div>
                    <div className="td fixed-flex min-w-105 font-size-12">Issued Date</div>
                    <div className="td fixed-flex min-w-105 font-size-12">Expiry Date</div>
                    <div className={"td fixed-flex padding-l-0 padding-r-0 min-w-" + (renderActionsCol ? 70: 60)}></div>
                </THead>
            </React.Fragment>;
        } else {
            let {
                id,
                data: {
                    created_at, title, training, trainer, type, competency_type, issued_date, expiry_date, accreditation_num, doc
                }
            } = item;
            
            const {type: training_type, course_or_module, job_title} = training || {};

            return <TRow key={id} className="w-full-calc-subtract-10">
                <div className="td fixed-flex min-w-140">
                    <h6 className="xs-shown font-size-13">Accreditation No.</h6>
                    {accreditation_num || 'N/A'}
                </div>
                <div className="td fixed-flex min-w-120">
                    <h6 className="xs-shown font-size-13">Certificate Type</h6>
                    {type || 'N/A'}
                </div>
                <div className="td fixed-flex min-w-160">
                    <h6 className="xs-shown font-size-13">Competency Type</h6>
                    {competency_type || 'N/A'}
                </div>
                <div className="td fixed-flex min-w-140">
                    <h6 className="xs-shown font-size-13">Training Type</h6>
                    {training_type || 'N/A'}
                </div>
                <div className="td">
                    <h6 className="xs-shown font-size-13">Course</h6>
                    {course_or_module ? (isString(course_or_module) ? course_or_module : (course_or_module.name || course_or_module.data.name)) : "N/A"}
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
}
// </editor-fold>

export default RenderRow;
