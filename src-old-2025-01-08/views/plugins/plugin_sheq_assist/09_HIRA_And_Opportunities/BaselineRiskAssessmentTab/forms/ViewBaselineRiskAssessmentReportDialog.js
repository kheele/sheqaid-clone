import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Button} from 'components/inputs';
import {Table} from 'components/tables';
import {AProfileDialog, ViewReportPDFDialog} from 'components/dialogs';

import RiskAssessmentItemTHead from '../../RAComponents/RiskAssessmentItemTHead';
import RiskAssessmentItemTBody from '../../RAComponents/RiskAssessmentItemTBody';

import style from "./ViewBaselineRiskAssessmentReportDialog.lazy.css";

@observer
class ViewBaselineRiskAssessmentReportDialog extends AProfileDialog {
    pageKey = "ViewBaselineRiskAssessmentReportDialog";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
        
        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
    }

    title() {
        return "View Baseline Risk Assessment Report";
    }
    
    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }

    get topButtons() {
        return <React.Fragment>
            <Button className="btn btn-primary save" onClick={this.onSaveAsPDF}>
                <i className="fa fa-file-pdf-o icon-left"/> Save As PDF
            </Button>
        </React.Fragment>;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/09_HIRA_And_Opportunities/baseline/";

    @observable
    state = {
        lists: {
            
        }
    };

    constructor() {
        super();
        
        this.printImpl  = this.printImpl.bind(this);
    }
    
    printImpl() {
        return neonBinding.events.emit(this.path + "create/pdf");
    }
    
    onSaveAsPDF(e, btn) {
        btn.text("Saving As PDF...").disabled();
        this.printImpl().then(res => {
            this.refs.viewReportPDFDialog.open(res);
            infoDialog.open("Record successfully saved as PDF.");
            infoDialog.close(2000);
        }).finally(() => {
            btn.text("Save As PDF").enabled();
        });  
    }
    
    get list() {
        return this.props.state.item;
    }

    render() {
        if (!this.list)
            return null;
        return (<div className="controls-wrapper print-element">
            <div className="controls">
                <div className="row row-table">
                    <div className="row sec-group">
                        <Table className="ARiskAssessmentItemTable RiskAssessmentItemTable w-full padding-0 margin-0">
                            <RiskAssessmentItemTHead hasFrequency/>
                            {this.list.map(({id, data: {created_at, activity, expiry_date, risk_tolerance, list}}, n) => <React.Fragment>
                                <label className="w-full font-size-17 padding-5">{n+1}. {activity}</label>    
                                <RiskAssessmentItemTBody name="list" defaultValue={list} readonly hasFrequency/>
                            </React.Fragment>)}
                        </Table>
                    </div>
                </div>
            </div>
            <ViewReportPDFDialog ref="viewReportPDFDialog" fileName="Risk_Assessment_Baseline_Full_Report" title="Baseline Risk Assessment Full Report"/>
        </div>);
    }
}

export default ViewBaselineRiskAssessmentReportDialog;
