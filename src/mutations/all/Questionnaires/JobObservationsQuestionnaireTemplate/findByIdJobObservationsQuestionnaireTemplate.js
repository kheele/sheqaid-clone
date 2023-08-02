/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";
import {
  job_observation_template_details_fragment
} from "views/plugins/plugin_hr_management/PlannedJobObservations/PlannedJobObservationsDialog/TemplatesTab/Query/Fragments";
import {orgs_no_project_and_site_fragment,} from "graphql/Fragments";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findOneJobObservationTemplateQuery {
        default_contractor_questionnaires(
          where: {id: {_eq: ${input}},},
        ) {
            ${job_observation_template_details_fragment}
            ${orgs_no_project_and_site_fragment}
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}