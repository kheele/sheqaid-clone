import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';
import {ATableSavable, SelectTable, Table, TBody, THead, TRow} from '../../../../../components/tables';

import style from "./ProfileCauseAnalysisDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileCauseAnalysisDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Cause Analysis";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
        lists: {
            general_agents: ['Struck By', 'Struck Against', 'Fall', 'Falling Object', 'Handling', 'Machine', 'Transport', 'Electricity'],
            occupational_health_or_enririnmental_agents: ['Chemical', 'Fumes', 'Fire', 'Gas', 'Dust', 'Noise', 'Vapour', 'Temperature'],
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
    
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at, 
                    she_incident_cost_list, 
                    general_agents, occupational_health_or_enririnmental_agents, 
                    sub_standard_practice_or_unsafe_act_list, sub_standard_condition_or_unsafe_condition_list,
                    personal_factor_list, job_factor_list,
                    addressing_personal_factor_list, addressing_job_factor_list
                }
            }
        } = this;
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                
                <div className="row">
                    <label className="col-lg-12 text-center">SHE Incident Costs</label>
                    <SHEIncidentCostsTable name="she_incident_cost_list" defaultValue={[...she_incident_cost_list, 'TOTALS']} onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label className="col-lg-12 text-center">Incident Cause Analysis</label>
                    <div className="row sec-group">
                        <ProfileField name="general_agents" value={general_agents} type="select" placeholder="General Agent(s)" required onChange={this.form.onChange} values={this.state.lists.general_agents}/>
                        <ProfileField name="occupational_health_or_enririnmental_agents" value={occupational_health_or_enririnmental_agents} type="select" placeholder="Occupational Health / Enririnmental Agent(s)" required onChange={this.form.onChange} values={this.state.lists.occupational_health_or_enririnmental_agents}/>
                    </div>
                </div>
                <div className="row">
                    <label className="col-lg-12 text-center">What Was The Direct / Immediate & The Basic / Root Cause Of The Incident</label>
                    <div className="row sec-group">
                        <label className="block text-center">Direct Causes / Immediate Causes</label>
                        <SelectTable name="sub_standard_practice_or_unsafe_act_list" defaultValue={sub_standard_practice_or_unsafe_act_list} readonly desc="Sub-Standard Practices / Unsafe Acts" className="col-lg-6 no-padding" list={this.state.lists.direct_causes_or_immediate_causes__sub_standard_practices_or_unsafe_acts} onChange={this.form.onChange}/>
                        <SelectTable name="sub_standard_condition_or_unsafe_condition_list" defaultValue={sub_standard_condition_or_unsafe_condition_list} readonly desc="Sub-Standard Conditions / Unsafe Conditions" className="col-lg-6 no-padding" list={this.state.lists.direct_causes_or_immediate_causes__sub_standard_practices_or_unsafe_conditions} onChange={this.form.onChange}/>
                    </div>
                    <hr className="margin-t-20"/>
                    <div className="row sec-group">
                        <label className="block text-center">Basic Causes / Root Causes / Indirect Causes</label>
                        <SelectTable name="personal_factor_list" defaultValue={personal_factor_list} readonly desc="Personal Factors" className="col-lg-6 no-padding" list={this.state.lists.direct_causes_or_immediate_causes__personal_factors} onChange={this.form.onChange}/>
                        <SelectTable name="job_factor_list" defaultValue={job_factor_list} readonly desc="Job Factors" className="col-lg-6 no-padding" list={this.state.lists.direct_causes_or_immediate_causes__job_factors} onChange={this.form.onChange}/>
                    </div>
                    <hr className="margin-t-20"/>
                    <div className="row sec-group">
                        <label className="block text-center">Preventive Action - Recommended</label>
                        <SelectTable name="addressing_personal_factor_list" defaultValue={addressing_personal_factor_list} readonly desc="Addressing Personal Factors" className="col-lg-6 no-padding" list={this.state.lists.preventive_action__personal_factors} onChange={this.form.onChange}/>
                        <SelectTable name="addressing_job_factor_list" defaultValue={addressing_job_factor_list} readonly desc="Addressing Job Factors" className="col-lg-6 no-padding" list={this.state.lists.preventive_action__job_factors} onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>;
    }

}

@observer
class SHEIncidentCostsTable extends ATableSavable {

    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
        if(item === 'TOTALS') {
            const cost = this.state.list.filter(v => v !== 'TOTALS').map(v => parseInt(v.cost)).reduce((n1, n2) => n1 + n2);
            return <TRow key={"item-" + n} className="tr-readonly tr-totals">
                <div className="td text-right"><span className="padding-r-10">Total</span></div>
                <div className="td fixed-flex min-w-180 text-right"><span className="padding-r-10">R {cost}</span></div>
            </TRow>;
        } else {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td"><span>{item.desc}</span></div>
                <div className="td fixed-flex min-w-180 text-right"><span className="padding-r-10">R {item.cost}</span></div>
            </TRow>;
        }
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">Description Of Damage / Medical Fees / Repair / Replacements / etc</div>
                <div className="td fixed-flex min-w-180">Replacement / Repair Cost</div>
            </THead>
            <TBody ref="body" title="SHE Incident Costs" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default ProfileDialog;
