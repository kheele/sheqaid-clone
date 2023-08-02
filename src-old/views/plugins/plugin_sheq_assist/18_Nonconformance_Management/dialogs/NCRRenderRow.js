// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {renderExpiryDateSpan} from '../../../../../utils/ComponentUtils';
import {Dates} from '../../../../../utils/Utils';
import {ActionsButton, Button} from '../../../../../components/inputs';
import {TRow} from '../../../../../components/tables';

import style from "./NCRRenderRow.lazy.css";
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
        const {item, source, selected_source, idx, onClick, renderActionsCol} = this.props;
        try{
            console.log('NCRRenderRow', item)
            let {
                id,
                data: {
                    //1
                    type, priority,
                    selected_source_item,
                    //2
                    desc, process,
                    //3
                    due_date, responsible_person, approving_person,
                    //4
                    document_list,
                    //5
                    comments, remarks,
                    //6
                    status, result, progress_date, completed_date, outstanding, additional_notes
                }
            } = item;

            let responsible_personName = null;
            let approving_personName = null;
            if(responsible_person) {
                const {fname, lname, data} = responsible_person;
                responsible_personName = (fname || data.fname).charAt(0).toUpperCase() + '. ' + (lname || data.lname);
            } else {
                responsible_personName = "";
            }
            if(approving_person) {
                const {fname, lname, data} = approving_person;
                approving_personName = (fname || data.fname).charAt(0).toUpperCase() + '. ' + (lname || data.lname);
            } else {
                approving_personName = "";
            }

            const resultClass = result === 'Pass' ? 'green' : result === 'Fail' ? 'red' : 'none';
            return <TRow key={id} className="NCRRenderRow w-full">
                <div className="td fixed-flex min-w-20">{idx + 1}</div>
                <div className="td fixed-flex min-w-100">{renderExpiryDateSpan(due_date)}</div>
                <div className="td fixed-flex min-w-130">{Dates.formatDate(completed_date) || 'N/A'}</div>
                <div className="td fixed-flex min-w-70">{priority || 'N/A'}</div>
                <div className="td fixed-flex min-w-180">{type || 'N/A'}</div>
                <div className="td">{desc}</div>
                <div className="td fixed-flex min-w-180">{responsible_personName}</div>
                <div className="td fixed-flex min-w-90">{status || 'N/A'}</div>
                <div className={`td fixed-flex min-w-60 td-result ${resultClass}`}>{result || 'N/A'}</div>
                {renderActionsCol && renderActionsCol(item, idx, onClick)}
                {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>}
            </TRow>;
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
