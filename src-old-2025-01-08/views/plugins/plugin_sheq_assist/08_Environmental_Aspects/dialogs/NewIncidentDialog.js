import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectEmployeeInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewIncidentDialog.lazy.css";

@observer
class NewIncidentDialog extends ANewDialog {
    pageKey = "NewIncidentDialog";
    title = "Create Incident";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/08_Environmental_Aspects/incidents/";

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

    constructor() {
        super();
        
        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;
                 
        if (!form.isValid('she_incident_date')) {
            infoDialog.open('Date Of Incident is required');
            return;
        }
        if (!form.isValid('she_incident_time')) {
            infoDialog.open('Time Of Incident is required');
            return;
        }
        if (!form.isValid('she_person_injured')) {
            infoDialog.open('Who Was Injured is required');
            return;
        }
        if (!form.isValid('she_contact_num')) {
            infoDialog.open('Contact No. is required');
            return;
        }
                     
        if (!form.isValid('she_age')) {
            infoDialog.open('Age is required');
            return;
        }
        if (!form.isValid('she_department')) {
            infoDialog.open('Department is required');
            return;
        }
        if (!form.isValid('she_regulator_occupation')) {
            infoDialog.open('Regulator Occupation is required');
            return;
        }
        if (!form.isValid('she_years_in_company_service')) {
            infoDialog.open('Years In Company Service is required');
            return;
        }

        if (!form.isValid('she_period_in_present_job')) {
            infoDialog.open('Period In Present Job is required');
            return;
        }
        if (!form.isValid('she_supervior')) {
            infoDialog.open('Supervior is required');
            return;
        }
        if (!form.isValid('she_department_head')) {
            infoDialog.open('Name Of Department Head is required');
            return;
        }
        
        if (!form.isValid('safety_incident_classification')) {
            infoDialog.open('Classification is required');
            return;
        }
        if (!form.isValid('safety_incident_parts_of_body_affected')) {
            infoDialog.open('Parts Of Body Affected is required');
            return;
        }
        if (!form.isValid('safety_incident_effect_on_person')) {
            infoDialog.open('Effect On Person is required');
            return;
        }
        if (!form.isValid('safety_incident_nature_of_incident')) {
            infoDialog.open('Nature Of Incident is required');
            return;
        }
        
        if (!form.isValid('damage_incident_classification')) {
            infoDialog.open('Classification is required');
            return;
        }
        if (!form.isValid('damage_incident_man_causes')) {
            infoDialog.open('Man Causes is required');
            return;
        }
        if (!form.isValid('damage_incident_natural_causes')) {
            infoDialog.open('Natural Causes is required');
            return;
        }
        
        if (!form.isValid('health_incident_classification')) {
            infoDialog.open('Classification is required');
            return;
        }
        if (!form.isValid('health_incident_occupational_stressor')) {
            infoDialog.open('Occupational Stressor is required');
            return;
        }
        if (!form.isValid('health_incident_natural_disease')) {
            infoDialog.open('Natural Disease is required');
            return;
        }
        
        if (!form.isValid('environmental_incident_classification')) {
            infoDialog.open('Classification is required');
            return;
        }
        if (!form.isValid('environmental_incident_type')) {
            infoDialog.open('Incident Type is required');
            return;
        }
        if (!form.isValid('environmental_incident_consequence')) {
            infoDialog.open('Incident Consequence is required');
            return;
        }
        if (!form.isValid('environmental_incident_severity')) {
            infoDialog.open('Severity is required');
            return;
        }
        if (!form.isValid('environmental_incident_state_of_pollutant')) {
            infoDialog.open('State Of Pollutant is required');
            return;
        }
        if (!form.isValid('environmental_incident_quality_of_pollutant')) {
            infoDialog.open('Quality Of Pollutant is required');
            return;
        }
        if (!form.isValid('environmental_incident_duration_of_pollution')) {
            infoDialog.open('Duration Of Pollution is required');
            return;
        }
        if (!form.isValid('environmental_incident_on_site_contained')) {
            infoDialog.open('On Site - Contained is required');
            return;
        }
        
        if (!form.isValid('investigator_designated')) {
            infoDialog.open('Designated Investigator (Team) is required');
            return;
        }
        if (!form.isValid('investigator_of_incident')) {
            infoDialog.open('Incident Investigator is required');
            return;
        }
        if (!form.isValid('investigator_incident_date')) {
            infoDialog.open('Date Of Incident is required');
            return;
        }
        
        const {
            she_incident_date, she_incident_time, she_person_injured, she_contact_num,
            she_age, she_department, she_regulator_occupation, she_years_in_company_service,
            she_period_in_present_job, she_supervior, she_department_head,
            safety_incident_classification, safety_incident_parts_of_body_affected, safety_incident_effect_on_person, safety_incident_nature_of_incident,
            damage_incident_classification, damage_incident_man_causes, damage_incident_natural_causes,
            health_incident_classification, health_incident_occupational_stressor, health_incident_natural_disease,
            environmental_incident_classification, environmental_incident_type, environmental_incident_consequence, environmental_incident_severity, environmental_incident_state_of_pollutant, environmental_incident_quality_of_pollutant, environmental_incident_duration_of_pollution, environmental_incident_on_site_contained,
            investigator_designated, investigator_of_incident, investigator_incident_date
        } = form.data;
        const data = {
            she_incident_date: she_incident_date.getTime(), she_incident_time, she_person_injured: {id: she_person_injured.id, fname: she_person_injured.data.fname, lname: she_person_injured.data.lname}, she_contact_num,
            she_age, she_department, she_regulator_occupation, she_years_in_company_service,
            she_period_in_present_job, she_supervior: {id: she_supervior.id, fname: she_supervior.data.fname, lname: she_supervior.data.lname}, she_department_head: {id: she_department_head.id, fname: she_department_head.data.fname, lname: she_department_head.data.lname},
            safety_incident_classification, safety_incident_parts_of_body_affected, safety_incident_effect_on_person, safety_incident_nature_of_incident,
            damage_incident_classification, damage_incident_man_causes, damage_incident_natural_causes,
            health_incident_classification, health_incident_occupational_stressor, health_incident_natural_disease,
            environmental_incident_classification, environmental_incident_type, environmental_incident_consequence, environmental_incident_severity, environmental_incident_state_of_pollutant, environmental_incident_quality_of_pollutant, environmental_incident_duration_of_pollution, environmental_incident_on_site_contained,
            investigator_designated, investigator_of_incident, investigator_incident_date: investigator_incident_date.getTime()
        };
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
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
                    <label>Internal Incident Investigation (SHE)</label>
                    <div className="row sec-group">
                        <ClearableInput name="she_incident_date" type="date" placeholder="Date Of Incident..." required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="she_incident_time" type="time" placeholder="Time Of Incident..." className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <SelectEmployeeInput name="she_person_injured" placeholder="Who Was Injured..." required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="she_contact_num" type="text" placeholder="Contact No." required className="col-lg-3 form-control" onChange={this.form.onChange}/>
        
                        <ClearableInput name="she_age" type="number" placeholder="Age" required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="she_department" type="text" placeholder="Department" required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="she_regulator_occupation" type="text" placeholder="Regulator Occupation" required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="she_years_in_company_service" type="number" placeholder="Years In Company Service" required className="col-lg-3 form-control" onChange={this.form.onChange}/>
        
                        <ClearableInput name="she_period_in_present_job" type="text" placeholder="Period In Present Job" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectEmployeeInput name="she_supervior" placeholder="Supervior..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <SelectEmployeeInput name="she_department_head" placeholder="Name Of Department Head..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>1. Safety Incident</label>
                    <div className="row sec-group">
                        <ClearableInput name="safety_incident_classification" type="select" placeholder="Classification..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.safety_incident_classification} returnValue/>
                        <ClearableInput name="safety_incident_parts_of_body_affected" type="select" placeholder="Parts Of Body Affected..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.parts_of_body_affected} returnValue/>
                        <ClearableInput name="safety_incident_effect_on_person" type="select" placeholder="Effect On Person..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.effect_on_person} returnValue/>
                        <ClearableInput name="safety_incident_nature_of_incident" type="text" placeholder="Nature Of Incident (describe the incident e.g laceration left hand index finger)" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>2. Damage Incident</label>
                    <div className="row sec-group">
                        <ClearableInput name="damage_incident_classification" type="select" placeholder="Classification..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.damage_incident_classification} returnValue/>
                        <ClearableInput name="damage_incident_man_causes" type="select" placeholder="Man Causes..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.man_causes} add returnValue/>
                        <ClearableInput name="damage_incident_natural_causes" type="select" placeholder="Natural Causes..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.natural_causes} add returnValue/>
                    </div>
                </div>
                <div className="row">
                    <label>3. Health Incident (Including over-exposure)</label>
                    <div className="row sec-group">
                        <ClearableInput name="health_incident_classification" type="select" placeholder="Classification..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.health_incident_classification} returnValue/>
                        <ClearableInput name="health_incident_occupational_stressor" type="select" placeholder="Occupational Stressor..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.occupational_stressor} returnValue/>
                        <ClearableInput name="health_incident_natural_disease" type="text" placeholder="Natural Disease (describe)" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>4. Environmental Incident</label>
                    <div className="row sec-group">
                        <ClearableInput name="environmental_incident_classification" type="select" placeholder="Classification..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.environmental_incident_classification} returnValue/>
                        <ClearableInput name="environmental_incident_type" type="select" placeholder="Incident Type..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.incident_type} add returnValue/>
                        <ClearableInput name="environmental_incident_consequence" type="select" placeholder="Incident Consequence..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.incident_consequence} add returnValue/>
                        <ClearableInput name="environmental_incident_severity" type="text" placeholder="Severity" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="environmental_incident_state_of_pollutant" type="text" placeholder="State Of Pollutant (e.g solid, liquid, etc)" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="environmental_incident_quality_of_pollutant" type="text" placeholder="Quality Of Pollutant (e.g 12g/m or less than 25ppm, etc)" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="environmental_incident_duration_of_pollution" type="select" placeholder="Duration Of Pollution..." required className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.duration_of_pollution} returnValue/>
                        <ClearableInput name="environmental_incident_on_site_contained" type="select" placeholder="On Site - Contained..." required className="col-lg-3 form-control" onChange={this.form.onChange} values={this.state.lists.on_site_contained} add returnValue/>
                    </div>
                </div>
                <div className="row">
                    <label>Investigator</label>
                    <div className="row sec-group">
                        <ClearableInput name="investigator_designated" type="radio" placeholder="Designated Investigator (Team) Appropriate To Investigate The Incident (Qualifications, Experience, Expertise, etc)" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.designated_investigator}/>
                        <ClearableInput name="investigator_of_incident" type="text" placeholder="Incident Investigator" required className="col-lg-8 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="investigator_incident_date" type="date" placeholder="Date Of Incident..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewIncidentDialog;
