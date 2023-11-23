import {getRiskRatingConsequenceList, getRiskRatingLikelihoodList} from "views/plugins/utils";

function map_sub_category_list(value) {
    return {value, label: value};
}

export default {
    group: ["Reportable (LTI)", "Non-Reportable (NLTI)"].map(value => {
        return {value, text: value, checked: false};
    }),
    sector_list: ['Forestry', 'Construction', 'Mining', 'Logistics', 'Railway', 'Manufacturing', 'Food',].map(value => {
        return {value, text: value, checked: false};
    }),
    gender: ['Male', 'Female'].map(value => {
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
    location: [],
    day_group: ['Morning', 'Afternoon'].map(value => {
        return {value, text: value, checked: false}
    }),
    time_shift: ['Day', 'Night'].map(value => {
        return {value, text: value, checked: false}
    }),
    risk_rating: ['Extreme', 'High', 'Moderate', 'Low'].map(value => {
        return {value, text: value, checked: false}
    }),
    consequence: getRiskRatingConsequenceList(),
    likelihood: getRiskRatingLikelihoodList()
//            incident: ["Near Miss", "First Aid", "Minor Injury", "Serious Injury", "Environmental Impact", "Crime", "Health", "Indutrial Action", "Accident", "Resource Wastage", "Equipment Failure", ], //
    //incident: ["Health", "Safety", "Hygiene", "Environment", "Compliance", "Energy", "Production", "Quality", "Security", "Transport Safety"],//
//            incident_whats_involved: ["Buildings", "Vehicle", "Equipment", "Environment", "Tools", "Health", "Theft"],
//
//            injury_type: ["Head", "Neck", "Eye", "Hand", "Finger", "Internal", "Arm", "Toe", "Foot", "Leg", "Trunk", "Back"],
//            indicate: ["Sprain", "Scratch", "Wounds", "Burns", "Disease", "Amputation", "Unconsciuos", "Fractures", "Electric Shock", "Poisoning", ],
//            health_or_diseases: ["Skin", "Resiratory", "Hearing", "Sight/Eye", "Muscular", "Skeletal", "Radiation Illness", "Poisoning", "Caparl Tunnel Syndrome", "Computer Vision Syndrome", "Neurological", "Psychological", "Pandemic", ],
//
//            human_causes: ["Theft", "Vandalism", "Wear And Year", "Civil Unrest", "Strike", "Fire", ],
//            natural_causes: ["Flood", "Cyclone", "Earthquake", "Tornado", "Hail", "Heavy Rain", "Lightning", ],
//            occupational_stressor_classification: ["Physical", "Biological", "Chemical", "Ergonomic"],
//
//            whats_damaged: ["Building", "Machinery", "Equipment", "Tools", "Vehicles", "Product", "Safety", "Environment", "Health", ],
//
//            suggested_preventative_action: ["Housekeeping", "Protection", "Modify", "Toolbox Talk", "Health", "Procedure", "Policy", "Training", "Medical", "Eliminate", "Disapline", "Guard", "Repair", "Lockout", ],

//            incident_reported_by: ["Employee", "Contractor", "Sub-contractor", "3rd Party"],
//            impact_type: ["Safety", "Health", "Environment", "Hygiene", "Productions", "Quality", "Road Safety", "Railway Safety", "Security Energy", "Compliance"],
};