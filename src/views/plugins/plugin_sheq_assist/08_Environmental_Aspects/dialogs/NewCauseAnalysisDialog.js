import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, SelectTable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewCauseAnalysisDialog.lazy.css";

@observer
class NewCauseAnalysisDialog extends ANewDialog {
    pageKey = "NewCauseAnalysisDialog";
    title = "Create Cause Analysis";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/08_Environmental_Aspects/incidents/cause-analysis/";

    @observable
    state = {
        lists: {
            general_agents: ['Struck By', 'Struck Against', 'Fall', 'Falling Object', 'Handling', 'Machine', 'Transport', 'Electricity'],
            occupational_health_or_environmental_agents: ['Chemical', 'Fumes', 'Fire', 'Gas', 'Dust', 'Noise', 'Vapour', 'Temperature'],
            direct_causes_or_immediate_causes__sub_standard_practices_or_unsafe_acts: [
                'Operating Equipment Without Authority',
                'Failure To Warn',
                'Failure To Secure Or Contain',
                'Operating In Improper Manner e.g. Speed',
                'Making Safety Or Control Devices Inoperable',
                'Removing Safety Or Control Devices',
                'Using Defective Equipment',
                'Using Equipment Improperly Or Incorrectly',
                'Failure To Use PPE',
                'Improper Loading',
                'Improper Placement',
                'Improper Lifting',
                'Improper Position For Task',
                'Servicing Equipment In Operation',
                'Under The Influence Of Alcohol Or Drugs',
                'Improper Resource Use Or Disposal',
                'Other'
            ],
            direct_causes_or_immediate_causes__sub_standard_practices_or_unsafe_conditions: [
                'Inadequate Guards Or Barriers',
                'Inadequate Protective/Control Equipment',
                'Improper Protective/Control Equipment',
                'Defective Tools/Equipment/Material',
                'Congestion Or Restricted Movement',
                'Inadequate Warning Systems',
                'Fire And Explosion Hazards',
                'Poor Housekeeping Or Disorderly Workplace',
                'Hazardous Environment',
                'Noise Exposures',
                'Radiation Exposures',
                'High/Low Temperature Exposures',
                'HCS Exposures (Dust, Fume, Vapour, etc.)',
                'Inadequate/Excessive Illumination',
                'Inadequate/Inappropriate Ventilation',
                'Inappropriate/Unsafe Design/Construction',
                'Other'
            ],
            direct_causes_or_immediate_causes__personal_factors: [
                'Unsuitable Physical/Physiological Capability',
                'Unsuitable Mental/Psychological Capability',
                'Physical Stress',
                'Lack Of Knowledge',
                'Lack Of Skill',
                'Improper Motivation',
                'Task Rarely Performed'
            ],
            direct_causes_or_immediate_causes__job_factors: [
                'Inadequate Leadership And/Or Supervision',
                'Inadequate Engineering Or Planning',
                'Inadequate Purchasing',
                'Inadequate Maintanance',
                'Inadequate Tools And Equipment',
                'Inadequate Work Standards/Procedures',
                'Wear And Tear',
                'Abuse Or Misuse'
            ],
            preventive_action__personal_factors: [
                'Instruct How To Follow Revised Work Standard',
                'Have Medically Examined',
                'Transfer To Another Job',
                'Attend SHE Committee Meeting',
                'Enforce/Warn',
                'Attend Specific Training (On The Job)',
                'Mentor',
                'Other'
            ],
            preventive_action__job_factors: [
                'Write Work Standards (Specifications)',
                'Revise Work Standards (Specifications)',
                'Review Risk Assessment',
                'Guard/Provide Protection',
                'Repair',
                'Modify',
                'Lock out',
                'Housekeeping',
                'Provide Protection',
                'Discuss Incident During Toolbox Talk'
            ]
        }
    };

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('she_incident_cost_list')) {
            infoDialog.open('SHE Incident Costs are required');
            return;
        }
        
        if (!form.isValid('general_agents')) {
            infoDialog.open('General Agent(s) is/are required');
            return;
        }
        if (!form.isValid('occupational_health_or_environmental_agents')) {
            infoDialog.open('Occupational Health / Environmental Agent(s) is/are required');
            return;
        }
        
        if (!form.isValid('sub_standard_practice_or_unsafe_act_list')) {
            infoDialog.open('Sub-Standard Practices / Unsafe Acts are required');
            return;
        }
        if (!form.isValid('sub_standard_condition_or_unsafe_condition_list')) {
            infoDialog.open('Sub-Standard Conditions / Unsafe Conditions are required');
            return;
        }
        
        if (!form.isValid('personal_factor_list')) {
            infoDialog.open('Personal Factors are required');
            return;
        }
        if (!form.isValid('job_factor_list')) {
            infoDialog.open('Job Factors are required');
            return;
        }

        if (!form.isValid('addressing_personal_factor_list')) {
            infoDialog.open('Addressing Personal Factors is required');
            return;
        }
        if (!form.isValid('addressing_job_factor_list')) {
            infoDialog.open('Addressing Job Factors is required');
            return;
        }

        const {
            she_incident_cost_list, 
            general_agents, occupational_health_or_environmental_agents, 
            sub_standard_practice_or_unsafe_act_list, sub_standard_condition_or_unsafe_condition_list,
            personal_factor_list, job_factor_list,
            addressing_personal_factor_list, addressing_job_factor_list
        } = form.data;
        const data = {
            she_incident_cost_list, 
            general_agents: isString(general_agents) ? [general_agents] : general_agents, 
            occupational_health_or_environmental_agents: isString(occupational_health_or_environmental_agents) ? [occupational_health_or_environmental_agents] : occupational_health_or_environmental_agents, 
            sub_standard_practice_or_unsafe_act_list, sub_standard_condition_or_unsafe_condition_list,
            personal_factor_list, job_factor_list,
            addressing_personal_factor_list, addressing_job_factor_list
        };
        console.log(data)

        btn.text("Saving...").disabled();
        workers.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <label>SHE Incident Costs</label>
                    <SHEIncidentCostsTable name="she_incident_cost_list" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label>Incident Cause Analysis</label>
                    <div className="row sec-group">
                        <ClearableInput name="general_agents" type="select" placeholder="General Agent(s)..." required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.general_agents} returnValue/>
                        <ClearableInput name="occupational_health_or_environmental_agents" type="select" placeholder="Occupational Health / Environmental Agent(s)..." required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.occupational_health_or_environmental_agents} returnValue/>
                    </div>
                </div>
                <div className="row">
                    <label>What Was The Direct / Immediate & The Basic / Root Cause Of The Incident</label>
                    <div className="row sec-group">
                        <label className="block text-center">Direct Causes / Immediate Causes</label>
                        <SelectTable name="sub_standard_practice_or_unsafe_act_list" desc="Sub-Standard Practices / Unsafe Acts" className="col-lg-6 no-padding" list={this.state.lists.direct_causes_or_immediate_causes__sub_standard_practices_or_unsafe_acts} onChange={this.form.onChange}/>
                        <SelectTable name="sub_standard_condition_or_unsafe_condition_list" desc="Sub-Standard Conditions / Unsafe Conditions" className="col-lg-6 no-padding" list={this.state.lists.direct_causes_or_immediate_causes__sub_standard_practices_or_unsafe_conditions} onChange={this.form.onChange}/>
                    </div>
                    <hr />
                    <div className="row sec-group">
                        <label className="block text-center">Basic Causes / Root Causes / Indirect Causes</label>
                        <SelectTable name="personal_factor_list" desc="Personal Factors" className="col-lg-6 no-padding" list={this.state.lists.direct_causes_or_immediate_causes__personal_factors} onChange={this.form.onChange}/>
                        <SelectTable name="job_factor_list" desc="Job Factors" className="col-lg-6 no-padding" list={this.state.lists.direct_causes_or_immediate_causes__job_factors} onChange={this.form.onChange}/>
                    </div>
                    <hr />
                    <div className="row sec-group">
                        <label className="block text-center">Preventive Action - Recommended</label>
                        <SelectTable name="addressing_personal_factor_list" desc="Addressing Personal Factors" className="col-lg-6 no-padding" list={this.state.lists.preventive_action__personal_factors} onChange={this.form.onChange}/>
                        <SelectTable name="addressing_job_factor_list" desc="Addressing Job Factors" className="col-lg-6 no-padding" list={this.state.lists.preventive_action__job_factors} onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

@observer
class SHEIncidentCostsTable extends ATableSavable {

    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td"><span>{item.desc}</span></div>
                <div className="td fixed-flex min-w-240"><span>R {item.cost}</span></div>
                <div className="td fixed-flex">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="desc" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex min-w-240">
                    <ClearableInput ref={this.onSetRef} name="cost" type="number" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex">
                    <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
                        <i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">Description Of Damage / Medical Fees / Repair / Replacements / etc</div>
                <div className="td fixed-flex min-w-240">Replacement / Repair Cost</div>
                <div className="td fixed-flex"></div>
            </THead>
            <TBody ref="body" title="SHE Incident Costs" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewCauseAnalysisDialog;
