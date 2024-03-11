// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Dates, RisksCodes} from 'utils/Utils';
import {ActionsButton, Button} from 'components/inputs';
import {TRow} from 'components/tables';

import style from "./HazchemSheetRenderRow.lazy.css";
import insertErrorReporting from "mutations/all/ErrorReporting/insertErrorReporting";
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
        try{
            console.log('hazchemsheet', item)
            let {id, data: {
                    created_at, name, contacts_manufacturer_name, msds, product, physical_state, type
                }
            } = item;
            const {
                // name,
                category,
                manufacturer,
                risk_level
            } = product || {};

            return <TRow key={id} className="HazchemSheetRenderRow w-full">
                <div className="td fixed-flex min-w-40 md-hidden">
                    <h6 className="xs-shown font-size-13">ID</h6>
                    {id}
                </div>
                <div className="td fixed-flex min-w-120 md-hidden">
                    <h6 className="xs-shown font-size-13">Date Created</h6>
                    {Dates.formatDate(created_at)}
                </div>
                <div className="td md-hidden">
                    <h6 className="xs-shown font-size-13">Name</h6>
                    {name}
                </div>
                <div className="td md-hidden">
                    <h6 className="xs-shown font-size-13">Category</h6>
                    {category || 'N/A'}
                </div>
                <div className="td md-hidden">
                    <h6 className="xs-shown font-size-13">Manufacturer</h6>
                    {contacts_manufacturer_name}
                </div>
                <div className="td fixed-flex min-w-120 md-hidden">
                    <h6 className="xs-shown font-size-13">Physical State</h6>
                    {physical_state}
                </div>
                <div className="td md-hidden">
                    <h6 className="xs-shown font-size-13">Type</h6>
                    {type}
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
            console.error('hazchem error', item)
            const onReport = (evt, btn) => {
                btn.text("Reporting...").disabled();
                insertErrorReporting({error: err, errorInfo: err}).
                finally(() => {
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
