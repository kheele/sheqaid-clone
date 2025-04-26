import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Button, Clickable, ProfileField} from 'components/inputs';
import {AProfileDialog, ViewReportPDFDialog} from 'components/dialogs';

import {CauseAnalysisPanel, RemedialOrCorrectiveActionPanel} from './IncidentComponents';
import {NavButtons} from 'components/FormComponents';

import style from "./ViewIncidentReportDialog.lazy.css";

@observer
class ViewIncidentReportDialog extends AProfileDialog {
    pageKey = "ViewIncidentReportDialog";

    constructor(props) {
        super(props, style);
        
        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
    }

    title() {
        return "Incident Report";
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
    path = "plugin_sheq_assist/17_Incident_Investigation/";

    @observable
    state = {
        
    };

    constructor() {
        super();
        
        this.printImpl  = this.printImpl.bind(this);
    }
    
    printImpl() {
        return workers.emit(this.path + "create/pdf", this.item.id);
    }
    
    onSaveAsPDF(e, btn) {
        btn.text("Saving As PDF...").disabled();
//        this.printImpl().then(res => {
            this.refs.viewReportPDFDialog.open({});
//            infoDialog.open("Record successfully saved as PDF.");
//            infoDialog.close(2000);
//        }).finally(() => {
//            btn.text("Save As PDF").enabled();
//        });  
    }
    
    get classification() {
        return this.props.state.item.data.classification;
    }
    
    get investigation() {
        return this.props.state.item.data.investigation;
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
                    created_at, status,
                    classification,
                    investigation,
                    sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data, 
                    sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data
                }
            }
        } = this;
        
        console.log('=', item)
        
        if(classification) {
            sec1_data = classification.sec1_data || sec1_data;
            sec2_data = classification.sec2_data || sec2_data;
            sec3_data = classification.sec3_data || sec3_data;
            sec4_data = classification.sec4_data || sec4_data;
        }
        
        let investigation_team_list = null;
        let investigation_due_date = null;
        if(investigation && investigation.sec1_data && investigation.sec1_data.investigation_team_list) {
            investigation_team_list = [...investigation.sec1_data.investigation_team_list, null];
        } else if(classification && classification.sec5_data && classification.sec5_data.investigation_team_list) {
            investigation_team_list = [...classification.sec5_data.investigation_team_list, null];
        }
        if(investigation && investigation.sec1_data && investigation.sec1_data.investigation_due_date) {
            investigation_due_date = investigation.sec1_data.investigation_due_date;
        } else if(classification && classification.sec5_data && classification.sec5_data.investigation_due_date) {
            investigation_due_date = classification.sec5_data.investigation_due_date;
        }
        
        const investigation_details = (investigation && investigation.sec2_data) ? investigation.sec2_data.investigation_details : null;
        const investigation_findings_list = (investigation && investigation.sec2_data && investigation.sec2_data.investigation_findings_list) ? 
            [...investigation.sec2_data.investigation_findings_list, null] : [null];
        const investigation_findings_further_desc = (investigation && investigation.sec2_data) ? investigation.sec2_data.investigation_findings_further_desc : null;
        const document_list = (investigation && investigation.sec2_data && investigation.sec2_data.document_list) ? 
            investigation.sec2_data.document_list : null;
        
        let consequence = null;
        let frequency = null;
        if(investigation && investigation.sec3_data && investigation.sec3_data.consequence) {
            consequence = investigation.sec3_data.consequence;
        } else if(sec14_data && sec14_data.consequence) {
            consequence = sec14_data.consequence;
        }
        if(investigation && investigation.sec3_data && investigation.sec3_data.frequency) {
            frequency = investigation.sec3_data.frequency;
        } else if(sec14_data && sec14_data.frequency) {
            frequency = sec14_data.frequency;
        }
        
        let cause_analysis = null;
        if(investigation && investigation.sec4_data && investigation.sec4_data.cause_analysis) {
            cause_analysis = investigation.sec4_data.cause_analysis;
        }
        
        let corrective_actions = null;
        if(investigation && investigation.sec5_data && investigation.sec5_data.corrective_actions) {
            corrective_actions = investigation.sec5_data.corrective_actions;
        }
        
        let distribution_list = null;
        if(investigation && investigation.sec6_data && investigation.sec6_data.distribution_list) {
            distribution_list = [...investigation.sec6_data.distribution_list, null];
        } else if(sec15_data && sec15_data.distribution_list) {
            distribution_list = [...sec15_data.distribution_list, null];
        }
        
        return (<div className="controls-wrapper controls-sectioned">
            
            <div className="controls">
                <div className="row active">
                    <label>
                        1. Incident Details 
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProfileField name="incident_date" title="Date Occurred" value={sec9_data && sec9_data.incident_date} type="date" className="col-lg-6"/>
                        <ProfileField name="incident_time" title="Time Occurred" value={sec9_data && sec9_data.incident_time} className="col-lg-6"/>
                        <ProfileField name="date_reported" title="Date Reported" value={sec7_data && sec7_data.date_reported} type="date" className="col-lg-6"/>
                        <ProfileField name="date_reported" title="Time Reported" value={sec7_data && sec7_data.time_reported} className="col-lg-6"/>
                        
                        <ProfileField name="incident_num" title="Incident ID" value={id} className="col-lg-6"/>
                        <ProfileField name="type" title="Type" value={sec3_data && sec3_data.type} className="col-lg-6"/>
                        
                        <ProfileField name="category_list" title="Category" value={sec1_data && sec1_data.category_list && sec1_data.category_list.join(', ')} className="col-lg-12"/>
                        <ProfileField name="exact_location" title="Exact Location" value={sec9_data && sec9_data.exact_location} className="col-lg-12"/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        2. Incident Description
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProfileField name="desc" title="Incident Description" value={sec10_data && sec10_data.desc} className="col-lg-12"/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        3. Cause Analysis 
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <CauseAnalysisPanel name="cause_analysis" defaultValue={cause_analysis} readonly/>
                    </div>
                    <NavButtons idx={3} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        4. Preventative / Corrective / Containment Actions 
                        <Clickable idx={4} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <RemedialOrCorrectiveActionPanel ref="corrective_actions" name="corrective_actions" defaultValue={corrective_actions} readonly/>
                    </div>
                    <NavButtons idx={4} onBack={onFormBack} onNext={onFormNext}/>
                </div>
            </div>
            <ViewReportPDFDialog ref="viewReportPDFDialog" fileName="Incident_Report" title="Incident Report"/>
        </div>);
    }
}

export default ViewIncidentReportDialog;
