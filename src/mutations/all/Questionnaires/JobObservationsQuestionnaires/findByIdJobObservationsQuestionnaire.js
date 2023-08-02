/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";
import {
  job_observation_details_fragment
} from "views/plugins/plugin_hr_management/PlannedJobObservations/PlannedJobObservationsDialog/ObservationsTab/Query/Fragments";
import {orgs_fragment} from "graphql/Fragments";

export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findOneJobObservationQuestionnaireQuery {
        default_contractor_questionnaires(
          where: {id: {_eq: ${input}},},
        ) {
            ${job_observation_details_fragment}
            ${orgs_fragment}
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}