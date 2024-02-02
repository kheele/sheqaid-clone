// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {renderExpiryDateSpan} from 'utils/ComponentUtils';
import {Dates} from 'utils/Utils';
import {ActionsButton, Button} from 'components/inputs';
import {TRow} from 'components/tables';

import style from "./NCRRenderRow.lazy.css";
import {Grid} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="componentMount">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    // </editor-fold>

    render() {
        const {item, source, selected_source, isExport, idx, onClick, renderActionsCol} = this.props;
        try{
            console.log('NCRRenderRow', item)
            let {
                id,
                data: {
                    //6
                    //progress_date, outstanding,

                    created_at,
                    client, project, site,
                    //1
                    type, priority, allocation,
                    selected_source_item,
                    //2
                    desc, process,
                    //3
                    due_date,
                    // responsible_person,
                    responsible_party_list,
                    assigned_job_position_list,
                    assigned_person_list,
                    // assigned_to_list,
                    approving_person,
                    //4
                    document_list, document_proof_list,
                    //5
                    comments, remarks,
                    //6
                    progress_list,
                    //7
                    status_acceptance, status_progress, result, completed_date, additional_notes
                }
            } = item;

            const assigned_to_list = [
                ...(assigned_job_position_list ? assigned_job_position_list.map(({job_position: {name}}) => name) : []),
                ...(assigned_person_list ? assigned_person_list.map(({employee: {full_name}}) => full_name) : []),
            ];

            const resultClass = result === 'Pass' ? 'green' : result === 'Fail' ? 'red' : 'none';
            const tbl = <>
                <div className="td fixed-flex min-w-20">{idx + 1}</div>
                <div className="td fixed-flex min-w-100">{renderExpiryDateSpan(due_date)}</div>
                <div className="td fixed-flex min-w-130">{Dates.formatDate(completed_date) || 'N/A'}</div>
                <div className="td fixed-flex min-w-70">{priority || 'N/A'}</div>
                <div className="td fixed-flex min-w-180">{type || 'N/A'}</div>
                {!isExport && <div className="td fixed-flex min-w-120">{allocation || 'N/A'}</div>}
                <div className="td">{desc}</div>
                <div className="td fixed-flex min-w-180">{
                    responsible_party_list && <Grid container spacing={1} columns={4}>
                      {responsible_party_list.map(({value}) => <Grid item><Chip label={value} size="small"/></Grid>)}
                  </Grid> || 'N/A'
                }</div>
                <div className="td fixed-flex min-w-180">{
                    assigned_to_list.isNotEmpty() ? <Grid container spacing={1} columns={4}>
                        {assigned_to_list.map((name) => <Grid item><Chip label={name} size="small"/></Grid>)}
                    </Grid>: 'N/A'
                }
                </div>
                <div className="td fixed-flex min-w-140">{status_progress || 'N/A'}</div>
                <div className={`td fixed-flex min-w-60 td-result ${resultClass}`}>{result || 'N/A'}</div>
                {renderActionsCol && renderActionsCol(item, idx, onClick)}
                {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>}
            </>;
            
            if(isExport) return tbl;
            
            return <TRow key={id} className="NCRRenderRow w-full">{tbl}</TRow>;
        } catch(err) {
            console.error('NCRRenderRow error', item)
            const onReport = (evt, btn) => {
                const data = {message: err.message || "", stack: err.stack || "", error_info: err.componentStack || ""};

                btn.text("Reporting...").disabled();
                neonBinding.events.emit("error-reporting/create", data).then(res => {
                    infoDialog.open(<React.Fragment>
                                <p>Problem successfully reported!</p> 
                                <p>We will fix it as soon as possible.</p>    
                            </React.Fragment>);
                    infoDialog.close(5000);
                }).finally(() => {
                    btn.text("Report Problem").enabled();
                });
            };
            return <div className="tr error">
                This row content contains errors.
                <Button className="btn btn-primary" text="Report Problem" onClick={onReport}/>
            </div>;
        }
    }
}
// </editor-fold>

export default RenderRow;
