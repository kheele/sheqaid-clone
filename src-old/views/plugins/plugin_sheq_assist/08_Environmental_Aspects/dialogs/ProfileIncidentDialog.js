import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';

import style from "./ProfileIncidentDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileIncidentDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Incident Investigation";
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
            //1
            safety_incident_classification: ['Fatality', 'Permanent Disabilty / Impairment', 'Low Work Day', 'Restrictive Work Day', 'W', 'First Aid', 'Near Miss'],
            parts_of_body_affected: ['Neck', 'Eye', 'Finger', 'Hand', 'Arm - Left', 'Arm - Right', 'Toe', 'Foot - Left', 'Foot - Right', 'Internal', 'Multiple'],
            effect_on_person: ['Sprains', 'Strains', 'Confusion', 'Wounds', 'Fractures', 'Burns', 'Amputation', 'Electrical Shock', 'Asphyxation', 'Unconcious', 'Poisoning', 'Multipe'],
            //2
            damage_incident_classification: ['Major', 'Serious', 'Moderate', 'Minor', 'Near Miss'],
            man_causes: ['MVA', 'Theft', 'Vandalism', 'Wear & Tear', 'Civil Unrest', 'Strike', 'Fire', 'Forklift', null],
            natural_causes: ['Flood', 'Cyclone', 'Earthquake', 'Tornado', 'Hail / Rain', 'Lightning', null],
            //3
            health_incident_classification: ['Health Fatality', 'Irreversible Occupational Diagnosed Disease', 'Reversible Occupational Diagnosed Disease', 'Noise Induced Hearing Loss'],
            occupational_stressor: ['Physical', 'Biological', 'Chemical', 'Ergonomical', 'Psychological'],
            //4
            environmental_incident_classification: ['Major', 'Medium', 'Minor', 'Near Miss'],
            incident_type: ['Contained Emission / Discharge', 'Uncontained Emission / Discharge', 'Controlled Emission / Discharge', 'Uncontrolled Emission / Discharge', 'Excessive Resource Use', 'Inappropriate Manipulation Of The Environment', 'Excessive Waste Generation  And/Or Disposal', 'Complaint/Undesired Public Or Media Attention', 'Environmental Damage - Natural', 'Environmental Damage - Human', null],
            incident_consequence: ['Pollution', 'Legal Non-Compliance', 'Permit Requirements Exceeded', 'Non-Compliance With Corporate Standard Or Policy', 'Financial Consequence', 'Common Law Claim', 'Nuisance To Public / Community', 'Damage To Public / Community', 'Socio-Economic Disruption', 'Ecological Stress / Damage', 'Resource Depletion', 'Climate Change', 'Negative Publicity', 'Alteration Of Physical Environment', null],
            duration_of_pollution: ['Less Than 1 Day', 'Less Than 1 Month', 'Less Than 1 Year', 'Less Than 5 Years', 'More Than 5 Years'],
            on_site_contained: ['On-Site - Not Contained', 'Local', 'Regional', 'National', 'Global', 'Off-Site Affecting On-Site', null],

            designated_investigator: [{text: 'Yes', value: 'Yes'}, {text: 'No', value: 'No'}]
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
                    she_incident_date, she_incident_time, she_person_injured, she_contact_num,
                    she_age, she_department, she_regulator_occupation, she_years_in_company_service,
                    she_period_in_present_job, she_supervior, she_department_head,
                    safety_incident_classification, safety_incident_parts_of_body_affected, safety_incident_effect_on_person, safety_incident_nature_of_incident,
                    damage_incident_classification, damage_incident_man_causes, damage_incident_natural_causes,
                    health_incident_classification, health_incident_occupational_stressor, health_incident_natural_disease,
                    environmental_incident_classification, environmental_incident_type, environmental_incident_consequence, environmental_incident_severity, environmental_incident_state_of_pollutant, environmental_incident_quality_of_pollutant, environmental_incident_duration_of_pollution, environmental_incident_on_site_contained,
                    investigator_designated, investigator_of_incident, investigator_incident_date
                }
            }
        } = this;
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <label>Internal Incident Investigation (SHE)</label>
                    <div className="row sec-group">
                        <ProfileField name="she_incident_date" type="date" value={she_incident_date} placeholder="Date Of Incident" required className="col-lg-3"/>
                        <ProfileField name="she_incident_time" type="time" value={she_incident_time} placeholder="Time Of Incident" className="col-lg-3"/>
                        <ProfileField name="she_person_injured" value={she_person_injured} renderer={v => v.fname + ' ' + v.lname} placeholder="Who Was Injured" required className="col-lg-3"/>
                        <ProfileField name="she_contact_num" placeholder="Contact No." value={she_contact_num} required className="col-lg-3"/>
        
                        <ProfileField name="she_age" type="number" placeholder="Age" value={she_age} required className="col-lg-3"/>
                        <ProfileField name="she_department" placeholder="Department" value={she_department} required className="col-lg-3"/>
                        <ProfileField name="she_regulator_occupation" value={she_regulator_occupation} placeholder="Regulator Occupation" required className="col-lg-3"/>
                        <ProfileField name="she_years_in_company_service" value={she_years_in_company_service} type="number" placeholder="Years In Company Service" required className="col-lg-3"/>
        
                        <ProfileField name="she_period_in_present_job" value={she_period_in_present_job} placeholder="Period In Present Job" required className="col-lg-4"/>
                        <ProfileField name="she_supervior" value={she_supervior} renderer={v => v.fname + ' ' + v.lname} placeholder="Supervior" required className="col-lg-4"/>
                        <ProfileField name="she_department_head" value={she_department_head} renderer={v => v.fname + ' ' + v.lname} placeholder="Name Of Department Head" required className="col-lg-4"/>
                    </div>
                </div>
                <div className="row">
                    <label>1. Safety Incident</label>
                    <div className="row sec-group">
                        <ProfileField name="safety_incident_classification" value={safety_incident_classification} type="select" placeholder="Classification" required className="col-lg-4" values={this.state.lists.safety_incident_classification}/>
                        <ProfileField name="safety_incident_parts_of_body_affected" value={safety_incident_parts_of_body_affected} type="select" placeholder="Parts Of Body Affected" required className="col-lg-4" values={this.state.lists.parts_of_body_affected}/>
                        <ProfileField name="safety_incident_effect_on_person" value={safety_incident_effect_on_person} type="select" placeholder="Effect On Person" required className="col-lg-4" values={this.state.lists.effect_on_person}/>
                        <ProfileField name="safety_incident_nature_of_incident" value={safety_incident_nature_of_incident} placeholder="Nature Of Incident (describe the incident e.g laceration left hand index finger)" required className="col-lg-12"/>
                    </div>
                </div>
                <div className="row">
                    <label>2. Damage Incident</label>
                    <div className="row sec-group">
                        <ProfileField name="damage_incident_classification" value={damage_incident_classification} type="select" placeholder="Classification" required className="col-lg-4" values={this.state.lists.damage_incident_classification}/>
                        <ProfileField name="damage_incident_man_causes" value={damage_incident_man_causes} type="select" placeholder="Man Causes" required className="col-lg-4" values={this.state.lists.man_causes} add/>
                        <ProfileField name="damage_incident_natural_causes" value={damage_incident_natural_causes} type="select" placeholder="Natural Causes" required className="col-lg-4" values={this.state.lists.natural_causes} add/>
                    </div>
                </div>
                <div className="row">
                    <label>3. Health Incident (Including over-exposure)</label>
                    <div className="row sec-group">
                        <ProfileField name="health_incident_classification" value={health_incident_classification} type="select" placeholder="Classification" required className="col-lg-4" values={this.state.lists.health_incident_classification}/>
                        <ProfileField name="health_incident_occupational_stressor" value={health_incident_occupational_stressor} type="select" placeholder="Occupational Stressor" required className="col-lg-4" values={this.state.lists.occupational_stressor}/>
                        <ProfileField name="health_incident_natural_disease" value={health_incident_natural_disease} placeholder="Natural Disease (describe)" required className="col-lg-4"/>
                    </div>
                </div>
                <div className="row">
                    <label>4. Environmental Incident</label>
                    <div className="row sec-group">
                        <ProfileField name="environmental_incident_classification" value={environmental_incident_classification} type="select" placeholder="Classification" required className="col-lg-4" values={this.state.lists.environmental_incident_classification}/>
                        <ProfileField name="environmental_incident_type" value={environmental_incident_type} type="select" placeholder="Incident Type" required className="col-lg-4" values={this.state.lists.incident_type} add/>
                        <ProfileField name="environmental_incident_consequence" value={environmental_incident_consequence} type="select" placeholder="Incident Consequence" required className="col-lg-4" values={this.state.lists.incident_consequence} add/>
                        <ProfileField name="environmental_incident_severity" value={environmental_incident_severity} placeholder="Severity" required/>
                        <ProfileField name="environmental_incident_state_of_pollutant" value={environmental_incident_state_of_pollutant} placeholder="State Of Pollutant (e.g solid, liquid, etc)" required/>
                        <ProfileField name="environmental_incident_quality_of_pollutant" value={environmental_incident_quality_of_pollutant} placeholder="Quality Of Pollutant (e.g 12g/m or less than 25ppm, etc)" required/>
                        <ProfileField name="environmental_incident_duration_of_pollution" value={environmental_incident_duration_of_pollution} type="select" placeholder="Duration Of Pollution" required className="col-lg-3" values={this.state.lists.duration_of_pollution}/>
                        <ProfileField name="environmental_incident_on_site_contained" value={environmental_incident_on_site_contained} type="select" placeholder="On Site - Contained" required className="col-lg-3" values={this.state.lists.on_site_contained} add/>
                    </div>
                </div>
                <div className="row">
                    <label>Investigator</label>
                    <div className="row sec-group">
                        <ProfileField name="investigator_designated" value={investigator_designated} type="radio" placeholder="Designated Investigator (Team) Appropriate To Investigate The Incident (Qualifications, Experience, Expertise, etc)" required className="col-lg-12" values={this.state.lists.designated_investigator}/>
                        <ProfileField name="investigator_of_incident" value={investigator_of_incident} placeholder="Incident Investigator" required className="col-lg-8"/>
                        <ProfileField name="investigator_incident_date" value={investigator_incident_date} type="date" placeholder="Date Of Incident" required className="col-lg-4"/>
                    </div>
                </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;
