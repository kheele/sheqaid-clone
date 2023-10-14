/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";
import {
    incident_investigation_corrective_actions_fragment
} from "views/plugins/plugin_sheq_assist/17_Incident_Investigation/CorrectiveActionsTab/Query/Fragments";

export default async (input: number) => GQLClient
    .query({
        query: `
      query findByIdIncidentCorrectiveActionQuery {
        sheq_incident_investigation_corrective_actions_by_pk(id: ${input}) {
          ${incident_investigation_corrective_actions_fragment}
        }
      }
    `});
