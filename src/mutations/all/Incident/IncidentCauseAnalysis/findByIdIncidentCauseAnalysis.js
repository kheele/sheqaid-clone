/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";
import {
    incident_investigation_cause_analysis_fragment
} from "views/plugins/plugin_sheq_assist/17_Incident_Investigation/InvestigationsTab/Query/Fragments";

export default async (input: number) => GQLClient
    .query({
        query: `
      query findByIdIncidentCauseAnalysisQuery {
        sheq_incident_investigation_cause_analysis_by_pk(id: ${input}) {
          ${incident_investigation_cause_analysis_fragment}
        }
      }
    `});
