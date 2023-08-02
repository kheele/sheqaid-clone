// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Dates, RisksCodes} from '../../../../utils/Utils';
import {ActionsButton, Button} from '../../../../components/inputs';
import {TRow} from '../../../../components/tables';

import style from "./MSDSRenderRow.lazy.css";
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
        const {item, idx, onClick, renderActionsCol} = this.props;
        try {
            console.log('sds', item)
            const {id, data: {created_at, name, common_names, category, manufacturer, risk_level, emergency_phone_nums = [], emergency_phone, date_identified, doc}} = item;
            return <TRow key={id} className="MSDSRenderRow w-full">
                <div className="td fixed-flex min-w-120 md-hidden">
                    <h6 className="xs-shown font-size-13">Date Created</h6>
                    {Dates.formatDate(created_at)}
                </div>
                <div className="td fixed-flex min-w-120 md-hidden">
                    <h6 className="xs-shown font-size-13">Date Identified</h6>
                    {Dates.formatDate(date_identified) || 'N/A'}
                </div>
                <div className="td md-hidden">
                    <h6 className="xs-shown font-size-13">Product Name</h6>
                    {name}{common_names && ` (${common_names})`}
                </div>
                <div className="td fixed-flex min-w-180 md-hidden">
                    <h6 className="xs-shown font-size-13">Emergency Phone No.</h6>
                    {emergency_phone_nums && emergency_phone_nums.join(', ')}
                </div>
                <div className="td md-hidden">
                    <h6 className="xs-shown font-size-13">Category</h6>
                    {category || 'N/A'}
                </div>
                <div className="td md-hidden">
                    <h6 className="xs-shown font-size-13">Manufacturer</h6>
                    {manufacturer || 'N/A'}
                </div>
                <div className={"td fixed-flex min-w-120 md-hidden td-risk-level " + RisksCodes.colorClassName(risk_level)}>
                    <h6 className="xs-shown font-size-13">Risk Level</h6>
                    <Button className="btn btn-primary pull-right min-w-40" text={risk_level || 'N/A'}/>
                </div>
                {renderActionsCol && renderActionsCol(item, idx, onClick)}
                {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                    <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
                </div>}
            </TRow>;
        } catch(err) {
            console.error('sds error', item)
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
