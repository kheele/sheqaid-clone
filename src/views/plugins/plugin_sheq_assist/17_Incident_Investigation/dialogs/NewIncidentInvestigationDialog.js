// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {isObservableArray, observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {getRiskRatingConsequenceList, getRiskRatingLikelihoodList} from 'views/plugins/utils';
import {Dates, execWhen} from 'utils/Utils';
import {AddFilesGridViewInput, ClearableInput, Clickable, ProfileField} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import {mapIncidentCorrectiveActions, mapIncidentPersonDetails} from 'utils/ArrayMapperUtils';
import {CauseAnalysisPanel, InvestigationFindingsTable, RemedialOrCorrectiveActionPanel} from './IncidentComponents';
import {NavButtons, RiskRating} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';
// </editor-fold>
import style from "./NewIncidentInvestigationDialog.lazy.css";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewIncidentInvestigationDialog";
    title = "Create Incident Investigation";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/17_Incident_Investigation/";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            weather_condition_list: ['Hot', 'Warm', 'Cool', 'Fine', 'Rainy', 'Windy', 'Snow', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            protective_equipment_worn_list: ['Hard Hat', 'Safety Boots', 'Eye Protection', 'Ear Protection', 'Fall Protection', 'Respiratory', 'Face Shield', 'Gloves'].map(value => {
                return {value, text: value, checked: false};
            }),
            class_list: ['Employee', 'Sub-Contractor', 'Visitor / Public', 'Client', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            disease_list: ['Safety', 'Health', 'Environment', 'Quality', 'Financial', 'Food Safety', 'Audit / Non-Conformance'].map(value => {
                return {value, text: value, checked: false};
            }),
            damage_list: ['Buildings', 'Machinery', 'Equipment', 'Tools', 'Vehicles', 'Product', 'Safety', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            environment_list: ['Waste Management', 'Hazardous Material', 'Public Safety', 'Public Complaint', 'Legal Non-Compliant', 'Spillage', 'Contractor'].map(value => {
                return {value, text: value, checked: false};
            }),
            consequence: getRiskRatingConsequenceList(),
            likelihood: getRiskRatingLikelihoodList()
        },
        riskRatingSelected: {
            consequence: null,
            likelihood: null
        }
    };
    // </editor-fold>

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("consequence", this.onChangeConsequence.bind(this));
        this.form.addChangeOne("likelihood", this.onChangeLikelihood.bind(this));
        this.form.addChangeOne("risk_rating", this.onChangeRiskRating.bind(this));
        this.form.addChangeOne("cause_analysis", this.onChangeCauseAnalysis.bind(this));
    }

    // <editor-fold defaultstate="collapsed" desc="onChange">
    onChangeConsequence(el, val) {
        if (val) {
            execWhen(() => this.refs.likelihood).then(() => {
                const {likelihood: likelihood_ref, risk_rating} = this.refs;
                this.state.riskRatingSelected.consequence = val;
                if(likelihood_ref.hasValue) {
                    this.state.riskRatingSelected.likelihood = likelihood_ref.value;
                }
            });
        }
    }
    
    onChangeLikelihood(el, val) {
        if (val) {
            execWhen(() => this.refs.consequence).then(() => {
                const {consequence: consequence_ref, risk_rating} = this.refs;
                this.state.riskRatingSelected.likelihood = val;
                if(consequence_ref.hasValue) {
                    this.state.riskRatingSelected.consequence = consequence_ref.value;
                }
            });
        }
    }
    
    onChangeRiskRating(el, val) {
        if (val) {
            const {consequence: consequence_ref, likelihood: likelihood_ref} = this.refs;
            this.state.riskRatingSelected.consequence = val.consequence;
            this.state.riskRatingSelected.likelihood = val.likelihood;
            
            const consequence = this.state.lists.consequence.find(item => item.value === val.consequence);
            const likelihood = this.state.lists.likelihood.find(item => item.value === val.likelihood);
            consequence && consequence_ref.onChange(consequence);
            likelihood && likelihood_ref.onChange(likelihood);
        }
    }
    
    onChangeCauseAnalysis(el, val) {
        if (val) {
            execWhen(() => this.refs.corrective_actions).then(corrective_actions_ref => {
                corrective_actions_ref.setCauseAnalysis(val);
            });
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('investigation_team_list') || form.get('investigation_team_list').isEmpty()) {
                infoDialog.open('Investigation Team is required');
                return;
            }
            if (!form.isValid('investigation_due_date')) {
                infoDialog.open('Investigation Due Date is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        if (!form.isValid('investigation_team_list') || form.get('investigation_team_list').isEmpty()) {
            infoDialog.open('Investigation Team is required');
            return;
        }
        if (!form.isValid('investigation_due_date')) {
            infoDialog.open('Investigation Due Date is required');
            return;
        }
        
        const {
            //1
            investigation_team_list, investigation_due_date,
            //2
            investigation_details,
            investigation_findings_list, investigation_findings_further_desc, document_list,
            //3
            consequence, likelihood, risk_rating,
            //4
            cause_analysis,
            //5
            corrective_actions,
            //6
            distribution_list,
            //7
            weather_condition_list,
            //8
            protective_equipment_worn_list,
            //9
            class_list,
            //10
            environment_list,
            //11
            estimated_costs_damages, estimated_costs_medical, estimated_costs_salaries_wages, estimated_costs_investigations, estimated_costs_others
        } = form.data;
        
        const data = {};
        
        if(this.investigation) {
            data.investigation = {
            };
            if(this.investigation.status && (isArray(this.investigation.status) || isObservableArray(this.investigation.status))) {
                data.investigation.status = toJS(this.investigation.status);
            } else {
                data.investigation.status = [];
            }
            
            //sec1_data
            const {sec1_data: old_sec1_data} = this.investigation;
            if(investigation_team_list && (!old_sec1_data || !old_sec1_data.investigation_team_list || toJS(old_sec1_data.investigation_team_list.map(v => v.id)) !== toJS(investigation_team_list.filter(v => !!v).map(v => v.other_person || v.id || v.employee.id)))) {
                data.investigation.sec1_data = {
                    investigation_team_list: investigation_team_list.filter(v => !!v).map(mapIncidentPersonDetails)
                };
            }
            if(investigation_due_date && (!old_sec1_data || old_sec1_data.investigation_due_date !== investigation_due_date.getTime())) {
                if(!data.investigation.sec1_data) {
                    data.investigation.sec1_data = {};
                }
                data.investigation.sec1_data.investigation_due_date = investigation_due_date.getTime();
            }
            
            //sec2_data
            const {sec2_data: old_sec2_data} = this.investigation;
            if(!old_sec2_data || old_sec2_data.investigation_details !== investigation_details) {
                data.investigation.sec2_data = {
                    investigation_details
                };
            }
            if(investigation_findings_list && (!old_sec2_data || !old_sec2_data.investigation_findings_list || toJS(old_sec2_data.investigation_findings_list) !== toJS(investigation_findings_list.filter(v => !!v).map(v => isString(v) ? v : v.text)))) {
                if(!data.investigation.sec2_data) {
                    data.investigation.sec2_data = {};
                }
                data.investigation.sec2_data.investigation_findings_list = toJS(investigation_findings_list.filter(v => !!v).map(v => isString(v) ? v : v.text));
            }
            if(!old_sec2_data || old_sec2_data.investigation_findings_further_desc !== investigation_findings_further_desc) {
                if(!data.investigation.sec2_data) {
                    data.investigation.sec2_data = {};
                }
                data.investigation.sec2_data.investigation_findings_further_desc = investigation_findings_further_desc;
            }
            if(document_list && (!old_sec2_data || !old_sec2_data.document_list || toJS(old_sec2_data.document_list) !== toJS(document_list.filter(v => !!v).map(v => v.path ? v.path : v)))) {
                if(!data.investigation.sec2_data) {
                    data.investigation.sec2_data = {};
                }
                data.investigation.sec2_data.document_list = toJS(document_list.filter(v => !!v).map(v => v.path ? v.path : v));
            }
            
            //sec3_data
            const {sec3_data: old_sec3_data} = this.investigation;
            if(!old_sec3_data || old_sec3_data.consequence !== consequence) {
                data.investigation.sec3_data = {
                    consequence
                };
            }
            if(!old_sec3_data || old_sec3_data.likelihood !== likelihood) {
                if(!data.investigation.sec3_data) {
                    data.investigation.sec3_data = {};
                }
                data.investigation.sec3_data.likelihood = likelihood;
            }
            if(!old_sec3_data || old_sec3_data.risk_rating !== risk_rating) {
                if(!data.investigation.sec3_data) {
                    data.investigation.sec3_data = {};
                }
                data.investigation.sec3_data.risk_rating = risk_rating;
            }
            
            //sec4_data
            const {sec4_data: old_sec4_data} = this.investigation;
            if(cause_analysis && (!old_sec4_data || !old_sec4_data.cause_analysis || toJS(old_sec4_data.cause_analysis) !== toJS(cause_analysis))) {
                data.investigation.sec4_data = {
                    cause_analysis: toJS(cause_analysis)
                };
            }
            
            //sec5_data
            const {sec5_data: old_sec5_data} = this.investigation;
            if(corrective_actions && (!old_sec5_data || !old_sec5_data.corrective_actions || toJS(old_sec5_data.corrective_actions.map(mapIncidentCorrectiveActions)) !== toJS(corrective_actions.filter(v => !!v).map(mapIncidentCorrectiveActions)))) {
                data.investigation.sec5_data = {
                    corrective_actions: toJS(corrective_actions.filter(v => !!v).map(mapIncidentCorrectiveActions))
                };
            }
            
            //sec6_data
            const {sec6_data: old_sec6_data} = this.investigation;
            if(distribution_list && (!old_sec6_data || !old_sec6_data.distribution_list || toJS(old_sec6_data.distribution_list.map(mapIncidentPersonDetails)) !== toJS(distribution_list.filter(v => !!v).map(mapIncidentPersonDetails)))) {
                data.investigation.sec6_data = {
                    distribution_list: toJS(distribution_list.map(mapIncidentPersonDetails))
                };
            }
            
            let {
                //7
                weather_condition_list: old_weather_condition_list = [],
                //8
                protective_equipment_worn_list: old_protective_equipment_worn_list = [],
                //9
                class_list: old_class_list = [],
                //10
                environment_list: old_environment_list = [],
                //11
                estimated_costs_damages: old_estimated_costs_damages, 
                estimated_costs_medical: old_estimated_costs_medical, 
                estimated_costs_salaries_wages: old_estimated_costs_salaries_wages, 
                estimated_costs_investigations: old_estimated_costs_investigations, 
                estimated_costs_others: old_estimated_costs_others
            } = this.investigation;
            //7
            if(weather_condition_list && weather_condition_list.slice() !== old_weather_condition_list.slice()) {
                data.investigation.weather_condition_list = toJS(weather_condition_list);
            }  
            //8
            if(protective_equipment_worn_list && protective_equipment_worn_list.slice() !== old_protective_equipment_worn_list.slice()) {
                data.investigation.protective_equipment_worn_list = toJS(protective_equipment_worn_list);
            }  
            //9
            if(class_list && class_list.slice() !== old_class_list.slice()) {
                data.investigation.class_list = toJS(class_list);
            }  
            //10
            if(environment_list && environment_list.slice() !== old_environment_list.slice()) {
                data.investigation.environment_list = toJS(environment_list);
            }  
            //11
            if(estimated_costs_damages && estimated_costs_damages !== old_estimated_costs_damages) {
                data.investigation.estimated_costs_damages = estimated_costs_damages;
            } 
            if(estimated_costs_medical && estimated_costs_medical !== old_estimated_costs_medical) {
                data.investigation.estimated_costs_medical = estimated_costs_medical;
            }  
            if(estimated_costs_salaries_wages && estimated_costs_salaries_wages !== old_estimated_costs_salaries_wages) {
                data.investigation.estimated_costs_salaries_wages = estimated_costs_salaries_wages;
            }  
            if(estimated_costs_investigations && estimated_costs_investigations !== old_estimated_costs_investigations) {
                data.investigation.estimated_costs_investigations = estimated_costs_investigations;
            }  
            if(estimated_costs_others && estimated_costs_others !== old_estimated_costs_others) {
                data.investigation.estimated_costs_others = estimated_costs_others;
            }  
        } else {
            data.investigation = {
                status: [],
                sec1_data: {},
                sec2_data: {},
                sec3_data: {},
                sec4_data: {},
                sec5_data: {},
                sec6_data: {}
            };
            //sec1_data
            if(investigation_team_list) {
                console.log('investigation_team_list', investigation_team_list)
                data.investigation.sec1_data.investigation_team_list = toJS(investigation_team_list.map(mapIncidentPersonDetails));
            }
            if(investigation_due_date) {
                data.investigation.sec1_data.investigation_due_date = investigation_due_date.getTime();
            }
            
            //sec2_data
            if(investigation_details) {
                data.investigation.sec2_data.investigation_details = investigation_details;
            }
            if(investigation_findings_list) {
                data.investigation.sec2_data.investigation_findings_list = toJS(investigation_findings_list);
            }
            if(investigation_findings_further_desc) {
                data.investigation.sec2_data.investigation_findings_further_desc = investigation_findings_further_desc;
            }
            if(document_list) {
                data.investigation.sec2_data.document_list = toJS(document_list.map(({path}) => path));
            }
            //sec3_data
            if(consequence) {
                data.investigation.sec3_data.consequence = consequence;
            }
            if(likelihood) {
                data.investigation.sec3_data.likelihood = likelihood;
            }
            if(risk_rating) {
                data.investigation.sec3_data.risk_rating = risk_rating;
            }
            //sec4_data
            if(cause_analysis) {
                data.investigation.sec4_data.cause_analysis = toJS(cause_analysis);
            }
            //sec5_data
            if(corrective_actions) {
                data.investigation.sec5_data.corrective_actions = toJS(corrective_actions.filter(v => !!v).map(mapIncidentCorrectiveActions));
            }
            //sec6_data
            if(distribution_list) {
                data.investigation.sec6_data.distribution_list = toJS(distribution_list.map(mapIncidentPersonDetails));
            }  
            
            //7
            if(weather_condition_list) {
                data.investigation.weather_condition_list = toJS(weather_condition_list);
            }  
            //8
            if(protective_equipment_worn_list) {
                data.investigation.protective_equipment_worn_list = toJS(protective_equipment_worn_list);
            }  
            //9
            if(class_list) {
                data.investigation.class_list = toJS(class_list);
            }  
            //10
            if(environment_list) {
                data.investigation.environment_list = toJS(environment_list);
            }  
            //11
            if(estimated_costs_damages) {
                data.investigation.estimated_costs_damages = estimated_costs_damages;
            } 
            if(estimated_costs_medical) {
                data.investigation.estimated_costs_medical = estimated_costs_medical;
            }  
            if(estimated_costs_salaries_wages) {
                data.investigation.estimated_costs_salaries_wages = estimated_costs_salaries_wages;
            }  
            if(estimated_costs_investigations) {
                data.investigation.estimated_costs_investigations = estimated_costs_investigations;
            }  
            if(estimated_costs_others) {
                data.investigation.estimated_costs_others = estimated_costs_others;
            }   
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "investigation", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });   
    }
    // </editor-fold>
    
    get classification() {
        return this.props.state.item.data.classification;
    }
    
    get investigation() {
        return this.props.state.item.data.investigation;
    }
    
    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
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
        let likelihood = null;
        if(investigation && investigation.sec3_data && investigation.sec3_data.consequence) {
            consequence = investigation.sec3_data.consequence;
        } else if(sec14_data && sec14_data.consequence) {
            consequence = sec14_data.consequence;
        }
        if(investigation && investigation.sec3_data && investigation.sec3_data.likelihood) {
            likelihood = investigation.sec3_data.likelihood;
        } else if(sec14_data && sec14_data.likelihood) {
            likelihood = sec14_data.likelihood;
        }
        
        let cause_analysis = null;
        if(investigation && investigation.sec4_data && investigation.sec4_data.cause_analysis) {
            cause_analysis = investigation.sec4_data.cause_analysis;
        }
        
        let corrective_actions = null;
        if(investigation && investigation.sec5_data && investigation.sec5_data.corrective_actions) {
            corrective_actions = investigation.sec5_data.corrective_actions;
        }
        
        //6
        let distribution_list = null;
        if(investigation && investigation.sec6_data && investigation.sec6_data.distribution_list) {
            distribution_list = [...investigation.sec6_data.distribution_list, null];
        } else if(sec15_data && sec15_data.distribution_list) {
            distribution_list = [...sec15_data.distribution_list, null];
        }
           
        let {
            //7
            weather_condition_list,
            //8
            protective_equipment_worn_list,
            //9
            class_list,
            //10
            environment_list,
            //11
            estimated_costs_damages, estimated_costs_medical, estimated_costs_salaries_wages, estimated_costs_investigations, estimated_costs_others
        } = investigation || {};
        
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <div className="row sec1_data active">
                    <label>
                        Incident Summary 
                        <Clickable idx={0} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProfileField name="incident_num" title="Incident No." value={id} className="col-lg-6"/>
                        <ProfileField name="category_list" title="Category" value={sec1_data && sec1_data.category_list && sec1_data.category_list.join(', ')} className="col-lg-12"/>
                        <ProfileField name="incident_date" title="Date Incident Occurred" value={sec9_data && sec9_data.incident_date} type="date" className="col-lg-6"/>
                        <ProfileField name="date_reported" title="Date Incident Reported" value={sec7_data && sec7_data.date_reported} type="date" className="col-lg-6"/>
                        <ProfileField name="short_desc" title="Short Description" value={sec1_data && sec1_data.short_desc} className="col-lg-12"/>
                        <ProfileField name="location" title="Location" value={sec9_data && sec9_data.location} className="col-lg-12"/>
                        <ProfileField name="exact_location" title="Exact Location" value={sec9_data && sec9_data.exact_location} className="col-lg-12"/>
                    </div>
                    <NavButtons idx={0} onNext={onFormNext}/>
                </div>
                <div className="row sec2_data">
                    <label>
                        1. Investigation Team
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <NewEmployeeListTable name="investigation_team_list" defaultValue={investigation_team_list} onChange={this.form.onChange}/>
                        <ClearableInput name="investigation_due_date" type="date" placeholder="Investigation Due Date..." defaultValue={Dates.parse(investigation_due_date)} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={1} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row sec3_data">
                    <label>
                        2. Investigation Details 
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="investigation_details" type="textarea"defaultValue={investigation_details} placeholder="Details Of Investigation" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <label className="margin-t-10 w-full">Investigation Findings</label>
                        <InvestigationFindingsTable name="investigation_findings_list" defaultValue={investigation_findings_list} onChange={this.form.onChange}/>
                        <ClearableInput name="investigation_findings_further_desc" type="textarea"  defaultValue={investigation_findings_further_desc} placeholder="Further Incident Investigation Findings" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <label className="margin-t-25 margin-l-20 w-full">Evidence Documents/Files</label>
                        <AddFilesGridViewInput name="document_list" title="Add Document/File"  defaultValue={document_list} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row sec4_data">
                    <label>
                        3. Potential Risk(s) of Incident 
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput ref="consequence" name="consequence" type="radio" defaultValue={consequence} placeholder="Consequence / Severity" className="col-lg-6 form-control" vertical onChange={this.form.onChange} values={this.state.lists.consequence} returnValue/>
                        <ClearableInput ref="likelihood" name="likelihood" type="radio" defaultValue={likelihood} placeholder="Likelihood / Probability" className="col-lg-6 form-control" vertical onChange={this.form.onChange} values={this.state.lists.likelihood} returnValue/>
                        <label className="margin-t-10 hor-center w-full">Incident Risk Rating Index</label>
                        <RiskRating selected={this.state.riskRatingSelected} ref="risk_rating" name="risk_rating" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={3} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row sec5_data">
                    <label>
                        4. Cause Analysis 
                        <Clickable idx={4} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <CauseAnalysisPanel name="cause_analysis" defaultValue={cause_analysis} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={4} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row sec6_data">
                    <label>
                        5. Preventative / Corrective / Containment Actions 
                        <Clickable idx={5} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <RemedialOrCorrectiveActionPanel ref="corrective_actions" name="corrective_actions" defaultValue={corrective_actions} onChange={this.form.onChange} onBack={onFormBack}/>
                    </div>
                    <NavButtons idx={5} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row sec8_data">
                    <label>
                        6. Distribution List
                        <Clickable idx={6} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <NewEmployeeListTable name="distribution_list" defaultValue={distribution_list} onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={6} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        7. Weather Conditions
                        <Clickable idx={7} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="weather_condition_list" type="checkbox" placeholder="Weather Conditions" defaultValue={weather_condition_list} vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.weather_condition_list} returnValue/>
                    </div>
                    <NavButtons idx={7} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        8. Protective Equipment Worn
                        <Clickable idx={8} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="protective_equipment_worn_list" type="checkbox" placeholder="Protective Equipment Worn" defaultValue={protective_equipment_worn_list} vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.protective_equipment_worn_list} returnValue/>
                    </div>
                    <NavButtons idx={8} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        9. Class
                        <Clickable idx={9} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="class_list" type="checkbox" placeholder="Class" defaultValue={class_list} vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.class_list} returnValue/>
                    </div>
                    <NavButtons idx={9} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        10. Environment
                        <Clickable idx={10} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="environment_list" type="checkbox" placeholder="Environment" defaultValue={environment_list} vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.environment_list} returnValue/>
                    </div>
                    <NavButtons idx={10} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row">
                    <label>
                        11. Estimated Costs
                        <Clickable idx={11} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ClearableInput name="estimated_costs_damages" type="number" isCurrency placeholder="Damages" defaultValue={estimated_costs_damages} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="estimated_costs_medical" type="number" isCurrency placeholder="Medical" defaultValue={estimated_costs_medical} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="estimated_costs_salaries_wages" type="number" isCurrency placeholder="Salaries / Wages" defaultValue={estimated_costs_salaries_wages} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="estimated_costs_investigations" type="number" isCurrency placeholder="Investigations" defaultValue={estimated_costs_investigations} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="estimated_costs_others" type="number" isCurrency placeholder="Others" defaultValue={estimated_costs_others} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                    <NavButtons idx={11} onBack={onFormBack}/>
                </div>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default NewDialog;
