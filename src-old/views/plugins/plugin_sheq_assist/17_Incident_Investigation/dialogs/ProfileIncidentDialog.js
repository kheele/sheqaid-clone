// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {getRiskRatingConsequenceList, getRiskRatingLikelihoodList} from '../../../utils';

import {AProfileDialog} from '../../../../../components/dialogs';
import {profileRender} from './IncidentForms';
// </editor-fold>
import style from "./ProfileIncidentDialog.lazy.css";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileIncidentDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Incident";
    }
    
    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
    
//    get topButtonsHiddenDelete() {
//        if(this.props.isRemoved) {
//            return true;
//        }
//        const {user} = storage.loggedUser;
//        const {permissions_other} = user.data;
//        const permissions_other_Employees = (permissions_other || []).find(v => v.key === "Employees");
//        if(!Permissions.allowRemove(permissions_other_Employees)) {
//            return true;
//        }
//        return this.isLoggedUser;
//    }
//    
//    get topButtonsHiddenPrint() {
//        const {user} = storage.loggedUser;
//        const {permissions_other} = user.data;
//        const permissions_other_Employees = (permissions_other || []).find(v => v.key === "Employees");
//        if(!Permissions.allowPrint(permissions_other_Employees)) {
//            return true;
//        }
//        return false;
//    }

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
            category_list: ['Safety', 'Health', 'Environment', 'Quality', 'Financial', 'Food Safety', 'Audit / Non-Conformance'].map(value => {
                return {value, text: value, checked: false};
            }),
            sub_category_list: ['IOD (Injury On Duty)', 'Damage', 'Occupational Health', 'Security'].map(value => {
                return {value, text: value, checked: false};
            }),
//            type: [{value: "Incident", text: "Incident", checked: false}, {value: "Accident", text: "Accident", checked: false}],
            type: ['Alcohol Testing', 'Arson', 'Assault', 'Fatality', 'Final Product', 'First Aid Injury', 'Forensic', 'Nearmiss', 'Irreversible Diagnosed Occupational Disease', 'Lost Time Injury', 'Medical Treatment Injury', 'Noise Induced Hearing Loss', 'Restricted Work Injury', 'Rreversible Diagnosed Occupational Disease', 'Structure', 'Vandalism', 'Vehicle Speeding', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            secondary_type_list: ['Alcohol Testing', 'Arson', 'Assault', 'Fatality', 'Final Product', 'First Aid Injury', 'Forensic', 'Nearmiss', 'Irreversible Diagnosed Occupational Disease', 'Lost Time Injury', 'Medical Treatment Injury', 'Noise Induced Hearing Loss', 'Restricted Work Injury', 'Rreversible Diagnosed Occupational Disease', 'Structure', 'Vandalism', 'Vehicle Speeding', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
            nature_of_injury_list: ["Abrasions", "Amputation", "Asphyxiation", "Burns (Chemical Burns)", "Burns (Hot Liquids)", "Burns (Hot Surfaces)",
                    "Contusion (Bruises)", "Electrical Shock", "Foreign Object In Eye", "Fracture", "Incision (Knives / Glass Cuts)", "Lacerations (Ragged Etched Wounds)",
                    "No Visible Injury", "Poisoning", "Puncture Wound", "Snake Spitting", "Snake Bite", "Sprains", "Strain", "Unconscious",
                    "Other Injuries (Specify)"].map(value => {
                return {value, text: value, checked: false};
            }),
            bodily_injury_location_list: ["Abdomen", "Ankle(Left)", "Ankle(Right)", "Arm(Left)", "Arm(Right)", "Chest",
                    "Ear/Hearing(Left)", "Ear/Hearing(Right)", "Elbow(Left)", "Elbow(Right)", "Eye(Left)", "Eye(Right)",
                    "Foot/Toe(s)(Left)", "Foot/Toe(s)(Right)", "Forearm(Left)", "Forearm(Right)",
                    "Hand/Finger(s)(Left)", "Hand/Finger(s)(Right)", "Head/Face", "Knee(Left)", "Knee(Right)",
                    "Leg(Left)", "Leg(Right)", "Mouth", "Neck", "Nose", "Pelvis", "Pubis",
                    "Shoulder(Left)", "Shoulder(Right)", "Thigh(Left)", "Thigh(Right)", "Wrist(Left)", "Wrist(Right)",

                    "Back", "Internal Organs", "Hips", "Respiratory", "Trunk",
                    "Other Injuries (Specify)"].map(value => {
                return {value, text: value, checked: false};
            }),
            injury_mechanism_list: ["Animals (All excl snakes)", "Assault", "Caught between or under (Crushed/Amputated)", "Caught In (Pinch & Nip Points)", "Contact With Chemicals",
                    "Contact With Electricity", "Contact With Flames", "Contact With High Temperature", /*"Contact With ...",*/ "Contact With Hot Surfaces",
                    "Contact With Noise", /*"Contact With ..."*/, "Contact With Sharp Object - Other", "Drowning", /*"...",*/,
                    "Falling Into", "Falling Object", /*"...",*/, "Handling (Lifting Or Pushing)", "Slipping",
                    /*"...",*/, "Struck Against (Running Or Bumping Into)", "Struck By Moving Object", /*"...",*/ "Vehicle",
                    "Other Or Multiple Mechanisms (Specify)"].map(value => {
                return {value, text: value, checked: false};
            }),
            gender: ['Male', 'Female', 'Other'].map(value => {
                return {value, label: value}
            }),
            test_undertaken: ['Yes', 'No'].map(value => {
                return {value, text: value, checked: false}
            }),
            test_type_list: ['Drug', 'Alcohol', 'Mobile Device'].map(value => {
                return {value, text: value, checked: false}
            }),
            test_type_drug_undertaken: ['Non-negative', 'Negative', 'Unknown at notification', 'Refusal'].map(value => {
                return {value, label: value, checked: false}
            }),
            test_type_alcohol_undertaken: ['Non-negative', 'Negative', 'Unknown at notification', 'Refusal'].map(value => {
                return {value, label: value, checked: false}
            }),
            test_type_mobile_device_undertaken: ['Yes', 'No', 'Unknown at notification', 'Suspected'].map(value => {
                return {value, label: value, checked: false}
            }),
            is_vehicle_incident: ['Yes', 'No'].map(value => {
                return {value, text: value, checked: false}
            }),
            was_3rd_party_involved: ['Yes', 'No'].map(value => {
                return {value, text: value, checked: false}
            }),
            are_3rd_party_details_available: ['Yes', 'No'].map(value => {
                return {value, text: value, checked: false}
            }),
            did_driver_admit_liability: ['Yes', 'No'].map(value => {
                return {value, text: value, checked: false}
            }),
            did_someone_else_admit_liability: ['Yes', 'No'].map(value => {
                return {value, text: value, checked: false}
            }),
            is_infringement_issued: ['Yes', 'No'].map(value => {
                return {value, text: value, checked: false}
            }),
            did_police_attend_scene: ['Yes', 'No'].map(value => {
                return {value, text: value, checked: false}
            }),
            collision_reported_to_police_station: ['Yes', 'No'].map(value => {
                return {value, text: value, checked: false}
            }),
            have_charges_been_laid: ['Yes', 'No', 'N/A'].map(value => {
                return {value, text: value, checked: false}
            }),
            consequence: getRiskRatingConsequenceList(),
            likelihood: getRiskRatingLikelihoodList()
//            incident: ["Near Miss", "First Aid", "Minor Injury", "Serious Injury", "Environmental Impact", "Crime", "Health", "Indutrial Action", "Accident", "Resource Wastage", "Equipment Failure", "Other"], //
            //incident: ["Health", "Safety", "Hygiene", "Environment", "Compliance", "Energy", "Production", "Quality", "Security", "Transport Safety"],//
//            incident_type: ["Personal Inquiry", "Security", "Fire", "Environment", "Property Damage", "Vehicle", "Plant"],
//            incident_whats_involved: ["Buildings", "Vehicle", "Equipment", "Environment", "Tools", "Health", "Theft"],
//
//            injury_type: ["Head", "Neck", "Eye", "Hand", "Finger", "Internal", "Arm", "Toe", "Foot", "Leg", "Trunk", "Back"],
//            indicate: ["Sprain", "Scratch", "Wounds", "Burns", "Disease", "Amputation", "Unconsciuos", "Fractures", "Electric Shock", "Poisoning", "Other"],
//            health_or_diseases: ["Skin", "Resiratory", "Hearing", "Sight/Eye", "Muscular", "Skeletal", "Radiation Illness", "Poisoning", "Caparl Tunnel Syndrome", "Computer Vision Syndrome", "Neurological", "Psychological", "Pandemic", "Other"],
//
//            human_causes: ["Theft", "Vandalism", "Wear And Year", "Civil Unrest", "Strike", "Fire", "Other"],
//            natural_causes: ["Flood", "Cyclone", "Earthquake", "Tornado", "Hail", "Heavy Rain", "Lightning", "Other"],
//            occupational_stressor_classification: ["Physical", "Biological", "Chemical", "Ergonomic"],
//
//            whats_damaged: ["Building", "Machinery", "Equipment", "Tools", "Vehicles", "Product", "Safety", "Environment", "Health", "Other"],
//
//            suggested_preventative_action: ["Housekeeping", "Protection", "Modify", "Toolbox Talk", "Health", "Procedure", "Policy", "Training", "Medical", "Eliminate", "Disapline", "Guard", "Repair", "Lockout", "Other"],

//            incident_reported_by: ["Employee", "Contractor", "Sub-contractor", "3rd Party"],
//            impact_type: ["Safety", "Health", "Environment", "Hygiene", "Productions", "Quality", "Road Safety", "Railway Safety", "Security Energy", "Compliance"],
        },
        riskRatingSelected: {
            consequence: null,
            likelihood: null
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    onSaveAsPDF(e, btn) {  
        this.refs.pdfReader.open(this.item);
    }
    // </editor-fold>
    
    get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return profileRender.call(this);
    }
    // </editor-fold>
}

export default ProfileDialog;