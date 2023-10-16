/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";
import {
    incident_corrective_actions_factors_fragment
} from "views/plugins/plugin_sheq_assist/17_Incident_Investigation/InvestigationsTab/Query/Fragments";

export default async (input: number) => GQLClient
    .query({
        query: `
      query findByIdIncidentCauseAnalysisCauseQuery {
        sheq_incident_investigation_cause_analysis_causes_by_pk(id: ${input}) {
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
      }
    `});
