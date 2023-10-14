/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";
import {
    incident_investigation_cause_analysis_immediate_fragment
} from "views/plugins/plugin_sheq_assist/17_Incident_Investigation/CorrectiveActionsTab/Query/Fragments";

export default async (input: number) => GQLClient
    .query({
        query: `
      query findByIdIncidentCauseAnalysisImmediateQuery {
        sheq_incident_investigation_cause_analysis_immediate_by_pk(id: ${input}) {
          ${incident_investigation_cause_analysis_immediate_fragment}
        }
      }
    `});
