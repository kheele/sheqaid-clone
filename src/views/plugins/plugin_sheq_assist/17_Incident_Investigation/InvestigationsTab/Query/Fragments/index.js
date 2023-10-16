import {employee_personal_details_fragment, personal_details_other_fragment} from "graphql/Fragments";

//<editor-fold desc="incident_corrective_actions_factors_fragment">
export const incident_corrective_actions_factors_fragment = `
      id
      text
      cost
      date_completed
      type
      responsible_person{
        id
        full_name
        email
        job_position{
          id
          name
        }
      }
`;
//</editor-fold>

//<editor-fold desc="incident_investigation_cause_analysis_immediate_fragment">
export const incident_investigation_cause_analysis_immediate_fragment = `
  id
      sub_standard_practices_or_unsafe_acts:cause_analysis_cause_list(where:{type:{_eq:"sub_standard_practices_or_unsafe_acts"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      sub_standard_practices_or_unsafe_conditions:cause_analysis_cause_list(where:{type:{_eq:"sub_standard_practices_or_unsafe_conditions"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      custom_sub_standard_practices_or_unsafe_acts:cause_analysis_cause_list(where:{type:{_eq:"custom_sub_standard_practices_or_unsafe_acts"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      custom_sub_standard_practices_or_unsafe_conditions:cause_analysis_cause_list(where:{type:{_eq:"custom_sub_standard_practices_or_unsafe_conditions"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
`;
//</editor-fold>

//<editor-fold desc="incident_investigation_cause_analysis_root_fragment">
export const incident_investigation_cause_analysis_root_fragment = `
  id
      custom_job_factors:cause_analysis_cause_list(where:{type:{_eq:"custom_job_factors"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      custom_personal_factors:cause_analysis_cause_list(where:{type:{_eq:"custom_personal_factors"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      job_factors:cause_analysis_cause_list(where:{type:{_eq:"job_factors"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
      personal_factors:cause_analysis_cause_list(where:{type:{_eq:"personal_factors"}}) {
          id
          text
          type
          corrective_action_list_job_factors:corrective_action_list(where:{type:{_eq: "job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_personal_factors:corrective_action_list(where:{type:{_eq: "personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_job_factors:corrective_action_list(where:{type:{_eq: "custom_job_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
          corrective_action_list_custom_personal_factors:corrective_action_list(where:{type:{_eq: "custom_personal_factors"}}){
            ${incident_corrective_actions_factors_fragment}
          }
      }
`;
//</editor-fold>

//<editor-fold desc="incident_investigation_cause_analysis_fragment">
export const incident_investigation_cause_analysis_fragment = `
  id
  immediate_analysis{
    ${incident_investigation_cause_analysis_immediate_fragment}
  }
  root_analysis{
    ${incident_investigation_cause_analysis_root_fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="incident_investigation_details_fragment">
export const incident_investigation_details_fragment = `
  id
  created_at
  due_date
  investigation_details
  estimated_costs_damages
  estimated_costs_medical
  estimated_costs_salaries_wages
  estimated_costs_investigations
  estimated_costs_others
  environment_list
  class_list
  protective_equipment_worn_list
  weather_condition_list
  investigation_findings_further_desc
  cause_analysis{
    id
    immediate_analysis{
      ${incident_investigation_cause_analysis_immediate_fragment}
    }
    root_analysis{
      ${incident_investigation_cause_analysis_root_fragment}
    }
  }
  severity{
    id
    consequence
    likelihood
    risk_rating
    risk_rating_score
  }
  distribution_list{
    id
    employee{
      ${employee_personal_details_fragment}
    }
    other_person{
      ${personal_details_other_fragment}
    }
  }
  document_list{
    id
    doc
    investigation_id
  }
  investigation_finding_list{
    id
    desc
    investigation_id
  }
  investigation_team_list{
    id
    investigator{
      ${employee_personal_details_fragment}
    }
    investigator_other{
      ${personal_details_other_fragment}
    }
    investigation_id
  }
  incident_list{
    id
  }
`;
//</editor-fold>
