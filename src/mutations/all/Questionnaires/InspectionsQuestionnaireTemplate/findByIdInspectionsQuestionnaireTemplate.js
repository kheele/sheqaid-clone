/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";
import {
  inspection_template_details_fragment
} from "views/plugins/plugin_sheq_assist/Inspections/TemplatesTab/Query/Fragments";
import {orgs_no_project_and_site_fragment,} from "graphql/Fragments";

export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findOneInspectionTemplateQuery {
        default_contractor_questionnaires(
          where: {id: {_eq: ${input}},},
        ) {
            ${inspection_template_details_fragment}
            ${orgs_no_project_and_site_fragment}
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}