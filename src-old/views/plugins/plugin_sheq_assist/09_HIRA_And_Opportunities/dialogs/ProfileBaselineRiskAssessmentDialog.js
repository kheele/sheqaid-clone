import React from "react";
import {observer} from 'mobx-react';
import {Button, Clickable, ProfileField} from '../../../../../components/inputs';
import {NavButtons} from '../../../../../components/FormComponents';
import {AProfileDialog, ViewReportPDFDialog} from '../../../../../components/dialogs';

import RiskAssessmentItemBaselineTable from './RiskAssessmentItemBaselineTable';

import style from "./ProfileBaselineRiskAssessmentDialog.lazy.css";

@observer
class ProfileBaselineRiskAssessmentDialog extends AProfileDialog {
    pageKey = "ProfileBaselineRiskAssessmentDialog";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
        
        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
    }
    
    

    title() {
        return "Baseline Risk Assessment";
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
    
    constructor() {
        super();
        
        this.printImpl  = this.printImpl.bind(this);
    }
    
    printImpl() {
        return neonBinding.events.emit(this.path + "create/pdf", this.item.id);
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
    
    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    activity, expiry_date, risk_tolerance, list,
                    site, project, client
                }
            }
        } = this;
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row active">
                    <label>
                        1. General Details
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">  
                        <div className="flex"> 
                            <div className="margin-t-5 margin-r-20">
                                <label>Company / Project / Site</label>
                                <ProfileField name="client" placeholder="Company" value={client} renderer={v => v.name || v.data.name} className="col-lg-12"/>
                                <ProfileField name="project" placeholder="Project" value={project} renderer={v => v.name || v.data.name} className="col-lg-12"/>
                                <ProfileField name="site" placeholder="Site" value={site} renderer={v => v.name || v.data.name} className="col-lg-12"/>
                            </div>
                            <div className="margin-t-5 margin-l-20">
                                <label>Basic Details</label>
                                <ProfileField name="activity" type="text" placeholder="Description Of Task" value={activity} className="col-lg-12"/>
                                <ProfileField name="expiry_date" type="date" placeholder="Revision Date" value={expiry_date} className="col-lg-12"/>
                                <ProfileField name="risk_tolerance" type="text" placeholder="Risk Tolerance" value={risk_tolerance} className="col-lg-12"/>
                            </div>
                        </div>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row row-table">
                    <label>
                        2. Assessed Items
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <RiskAssessmentItemBaselineTable name="list" readonly defaultValue={list}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack}/>
                </div>
            </div>
            <ViewReportPDFDialog ref="viewReportPDFDialog" fileName="Risk_Assessment_Baseline_Report" title={"Baseline Risk Assessment (" + activity + ")"}/>
        </div>);
    }
}

export default ProfileBaselineRiskAssessmentDialog;
