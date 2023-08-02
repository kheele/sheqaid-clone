import {getRiskRatingConsequenceList, getRiskRatingLikelihoodList} from "../../../../utils";

function map_sub_category_list(value) {
    return {value, label: value};
}

export default {
    group: ["Reportable (LTI)", "Non-Reportable (NLTI)"].map(value => {
        return {value, text: value, checked: false};
    }),
    category_list: ["Accident", "Audit/Non-Conformance", "Complaints / HR Occurrence", "Compliance", "Workplace stressors", "Ergonomics", "Occupational Hygiene",
        "Positive Observation", "Damage", "Fire", "Legal Non-Compliance", "Natural Event", "Criminal", "Animals",
        "Untoward Incident", "Energy", "Equipment Failure", "Occupational health", "Production", "Psycho-social",
        "Security", 'Safety', 'Environment', 'Quality', 'Financial', 'Food Safety'].map(value => {
        return {value, text: value, checked: false};
    }),
    sub_category_list: {
        "Accident": [
            'Collision',
            'Explosion',
            'Fire',
            'Hazardous substance release',
        ].map(map_sub_category_list),
        "Audit/Non-Conformance": [
            "Major NC",
            "Minor NC",
            "Observation",
            "Suggestion",
            "Audit Findings",
            'Legal',
            'Quality',
        ].map(map_sub_category_list),
        "Complaints / HR Occurrence": [
            "Internal",
            "External",
            "Customer complaints",
            "Land Invasion",
            "Vendor non compliant",
            "Grievance",
            "Client",
            'Dispute',
            'Go slow',
        ].map(map_sub_category_list),
        "Compliance": [
            "Document review",
            "Site rules",
            "Policies & procedure",
            "Training",
            "Labeling",
            "Production",
            "Security",
            "Safety",
            "Health",
            "Engineering",
            "Environment",
            "Fire",
            'Legal compliance',
            'SABS/SANS',
            'Health and Safety',
            'Environmental',
            'By-Laws',
            'Corruption',
            'Social responsibility',
            'ISO Standard',
        ].map(map_sub_category_list),
        "Workplace stressors": [
            "Anxiety",
            "Sadness/ Depression",
            "Fatique",
            "Unrealistic demand",
            "Organizational change",
            "Harrassment",
            "Lack of recognition",
            "Workload",
            "Poor interpesonal relationship",
        ].map(map_sub_category_list),
        "Ergonomics": [
            'Computer use',
            'Chairs',
            'Desks',
            'Keyboard/mouse',
            'Equipment layout',
            'Adjustable sit/workstation',
            'Work stress',//bold
            'Typing',
            'Extreme temperature',//bold
            'Noise',
            'Sitting',//colon
            'Standing',//colon
            'Lifting',
            'Twisting',
            'Bending',
            'Awkward position',
            'Eye strain',
            'Repetition',//bold
            'Awkward posture',//bold
            'Forceful motion',//bold
            'Stationary position',//bold
            'Direct pressure',//bold
            'Vibration',//bold
        ].map(map_sub_category_list),
        "Occupational Hygiene": [
            "Chemicals",
            "Biological",
            "Physical",
            "Finding / NC",
            "Recommendations",
            'cold',
            'dust',
            'ergonomics',
            'fumes',
            'gasses',
            'heat',
            'illumination',
            'noise',
            'psychological',
            'radiation',
            'smoke',
            'vapours',
            'ventilation',
        ].map(map_sub_category_list),
        "Positive Observation": [
            "Follow procedure",
            "Correct PPE",
            "Tools in good working order",
            "Risk management",
            "Labour carrier in good condition",
            "Vehicle in good working order",
        ].map(map_sub_category_list),
        "Damage": [
            "Malicious damage",
            "Product",
            "Vehicle",
            "Property",
            "Structure",
            "Product",
            "Machinery",
            "Equipment & tools",
        ].map(map_sub_category_list),
        "Fire": [
            "Hot work",
            "Vehicle Fire",
            "Veld fire",
            "Lightening",
            "Friction",
            "Reaction",
            "Explosion",
            "Electrical",
            "Direct Heating",
            "Fire",
        ].map(map_sub_category_list),
        "Legal Non-Compliance": [
            'Appointments',
            'Inspections',
            'Pollution',
            'Contractor',
            'Sub-contactor',
            'Employee',
            'Waste management',
            'Equipment',
            'Act',
            'Regulation',
            'Risk assessment',
            'Safe guards',
            'Permit to work',
            'Stacking and storage',
            'Working at heights',
            'Signage and labeling',
            'Chemical handling',
            'Inspector recommendations',
        ].map(map_sub_category_list),
        "Natural Event": [
            "Storm",
            "Floods",
            "Lightening",
            'Earthquake',
            'Hurricane/Cyclone',
            'Wind',
        ].map(map_sub_category_list),
        "Criminal": [
            "Theft",
            "Assault",
            "Fraud",
            "Housebreaking",
            "High jack",
            "Corruption",
            "Sexual Assault",
            'Industrial',
            'Violent crime',
            'Sabotage/vandalism',
            'Espionage',
        ].map(map_sub_category_list),
        "Animals": [
            "Domestic",
            "Poaching",
            "Wild",
        ].map(map_sub_category_list),
        "Untoward Incident": [
            'Not within our work area',
            'After working hours',
        ].map(map_sub_category_list),
        "Energy": [
            "Electrical",
            "Mechanical",
            "Hydraulic",
            "Chemical",
            "Thermal",
        ].map(map_sub_category_list),
        "Equipment Failure": [
            "Component",
            "Structural",
        ].map(map_sub_category_list),
        "Occupational health": [
            "Occupational disease (Potential)",
            "Occupational disease (Reversible)",
            "Occupational disease (Permanent)",
            "Biological (virus)",
            "Biological (Bacteria)",
            "Biological (Insects)",
            "Biological (Animals)",
        ].map(map_sub_category_list),
        "Production": [
            "Training",
            "Faulty/ inaccurate inventory",
            "Insufficient control",
            "Stakeholder agreement-differences",
            "Unrealistic expectation",
            "Equipment/tools malfunction",
            "Skill gap",
            "Audit Finding",
            "Conformance to Standard",
            "Operational error",
            "Natural events",
            'Raw material',
            'Supply failure',
            'Utility failure',
        ].map(map_sub_category_list),
        "Psycho-social": [
            "Fines",
            "Sanctions",
            'Bullying',
            'Violence',
            'Aggression',
            'Harassment',
            'Fatigue',
            'Stress',
            'Burnout',
        ].map(map_sub_category_list),
        "Security": [
            "Malicious damage",
            "Trespassing",
            "Strike",
        ].map(map_sub_category_list),
        "Safety": [
            "Near miss",//cut the form
            "Potential injury",
            "Potential LTI",
            "Potential Fatality",
            "Equipment damage",
            "Potential Plant Damage",
            "Potential Property damage",
            "Potential infrastructure damage",
            // "Injury-Whole form",
            "First Aid",
            "NLTI",
            "LTI",
            "Fatality"
        ].map(map_sub_category_list),
        "Environment": [
            "Water Pollution",
            "Air Pollution",
            "Environment pollution",
            "Spillage / Leakage",
            "Chemicals",
            "Oils",
            'Noise polution',
            'Environmental ergonomics',
            'Environmental damage',
            'Environmental fines/ Penalty',
            'Engineering Factors',
            'Environmental Permits',
            'EIA',
            'Erosion',
            'Emission',
            'Impact',
        ].map(map_sub_category_list),
        "Quality": [
            'Client specification',
            'Customer expectation',
            'Communication',
            'Training and competence',
            'Quality Process/procedure',
            'Quality Audit',
            'Leadership',
            'Planning',
            'Quality inspection',
            'Product Recall',
            'Image/Reputational loss',
            'Sub-standard quality Product/service',
        ].map(map_sub_category_list),
        "Financial": [
            "Operational Risk",
            "Credit/Default risk",
            "Liquidity risk",
            "Market risk",
            "Legal risk",
            "Inflation risk",
            "Political Risk",
            'Insurance Risk',
            'Profit and loss Risk',
            'Interest rate',
            'Exchange rate',
            'Comodity price',
            'Stock price',
            'Market change',
            'Fluctuation',
        ].map(map_sub_category_list),
        "Food Safety": [
            "Non-Compliance",
            "Storage",
            "Contamination",
            "Hygiene",
            "Cleanness",
            "food poisoning",
            "Fines",
            'Claims',
            'Inspections',
            'Competence',
        ].map(map_sub_category_list),
        options: []
    },
    sector_list: ['Forestry', 'Construction', 'Mining', 'Logistics', 'Railway', 'Manufacturing', 'Food',].map(value => {
        return {value, text: value, checked: false};
    }),
    activity_list: {
        "Forestry": [
            "Harvesting",//
            "Loading",
            "off-loading",
            "stacking",
            "Travelling",
            "Securing",
            "Felling",
            "Cross cutting",
            "Debarking",
            "Deb-ranching",

            "Silviculture",//
            "Preparation",
            "Fertilizing",
            "Mowing",
            "Blanking",
            "Planting",
            "Pruning",
            "Chemical spraying",
            "Weeding",
            "Slashing",
            "Brush cutting",
            "Marking and pitting",
            "Ripping",
            "Thinning",
            "Coppice Reduction",
            "Grading",

            "BURNING (FIRE)",//
            "Burning slash (Fire)",
            "Burning fire break",
            "Burning under canopy",
            "Fuel reduction",

            "Chemical handling",//
            "Manual spraying",
            "Mechanical spraying",
        ].map(map_sub_category_list),
        "Construction": [
            "Building construction",//
            "Electrical work",
            "Building maintenance",
            "Roof maintenance",
            "New infrastructure",
            "Cleaning building",
            "Cleaning offices",
            "Garden maintenance",
            "Infrastructure maintenance",
            "Survey",
            "Sampling",
            "Working at heights",//

            "Road construction",//
            "Road maintenance",
            "Sourcing / extracting quarry",
            "Offloading material",
            "Loading material",
            "Grading/ leveling material",
            "Maintaining/ building drains",
            "Building bridges",
            "Compacting/ rolling",
            "Digging/ excavations",
            "Stream crossing",
            "Transporting material",
            "Blasting",
            "Paving",
            "Scaffolding",
            "Storm water pipes",
        ].map(map_sub_category_list),
        "Mining": [
            "Prospecting",
            "Exploration",
            "Maintenance",
            "Expansion",
            "Operations",
            "Blasting",
            "Gold extraction",
            "Quarry",
            "Metal ore",
            "Coal",
            "oil and gas",
            "Survey",
            "Sampling",
        ].map(map_sub_category_list),
        "Logistics": [
            "Transport",
            "Diesel",
            "Petrol",
            "Gas",
            "People",
            "Travelling",
            "Labour transport",
            "Maintenance",
            "Driving/operating",
            "Cleaning vehicle/ machine",
        ].map(map_sub_category_list),
        "Railway": [
            "Maintenance",
            "New infrastructure",
        ].map(map_sub_category_list),
        "Manufacturing": [
            "Cement",
            "Apparel and textile",
            "Steel and metal",
            "Food production",
            "Oil, chemical and plastic",
        ].map(map_sub_category_list),
        "Food": [
            "Production",
            "Processing",
            "Distribution",
            "Preservation",
            "Packaging",
            "Certification",
            "Customer satisfaction",
            "Safety",
        ].map(map_sub_category_list),
        options: []
    },
    nature_of_injury_list: ["Abrasions", "Amputation", "Asphyxiation", "Burns (Chemical Burns)", "Burns (Hot Liquids)", "Burns (Hot Surfaces)",
        "Contusion (Bruises)", "Electrical Shock", "Foreign Object In Eye", "Fracture", "Incision (Knives / Glass Cuts)", "Lacerations (Ragged Etched Wounds)",
        "No Visible Injury", "Poisoning", "Puncture Wound", "Snake Spitting", "Snake Bite", "Sprains", "Strain", "Unconscious"]/*.map(value => {
                return {value, label: value};
            })*/,
    bodily_injury_location_list: ["Abdomen", "Ankle(Left)", "Ankle(Right)", "Arm(Left)", "Arm(Right)", "Chest",
        "Ear/Hearing(Left)", "Ear/Hearing(Right)", "Elbow(Left)", "Elbow(Right)", "Eye(Left)", "Eye(Right)",
        "Foot/Toe(s)(Left)", "Foot/Toe(s)(Right)", "Forearm(Left)", "Forearm(Right)",
        "Hand/Finger(s)(Left)", "Hand/Finger(s)(Right)", "Head/Face", "Knee(Left)", "Knee(Right)",
        "Leg(Left)", "Leg(Right)", "Mouth", "Neck", "Nose", "Pelvis", "Pubis",
        "Shoulder(Left)", "Shoulder(Right)", "Thigh(Left)", "Thigh(Right)", "Wrist(Left)", "Wrist(Right)",

        "Back", "Internal Organs", "Hips", "Respiratory", "Trunk"]/*.map(value => {
                return {value, label: value};
            })*/,
    injury_mechanism_list: [
        "Animals (All excl snakes)", "Assault",

        "Bite/sting",

        "Caught between or under (Crushed/Amputated)", "Caught In (Pinch & Nip Points)",
        "Caught On (Hung)",

        "Contact With Chemicals", "Contact With Electricity", "Contact With Flames",
        "Contact With High Temperature", "Contact With Hot Surfaces", "Contact With Noise",
        "Contact With Sharp Object - Other",

        "Drowning",

        "Equipment",

        "Falling Into", "Falling Object", "Fall from elevated",

        "Handling (Lifting Or Pushing)",

        "Machinery",

        "Over stress",

        "Plant",

        "Slipping", "Struck Against (Running Or Bumping Into)", "Struck By Moving Object",

        "Trip", "Tools",

        "Vehicle"
    ],
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
    time_shift: ['Day', 'Night'].map(value => {
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