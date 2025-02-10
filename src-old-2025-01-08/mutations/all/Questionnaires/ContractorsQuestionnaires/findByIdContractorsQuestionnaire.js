/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";
import {
  contractor_questionnaire_details_fragment
} from "views/plugins/plugin_extra/__B_Contractors/AQuestionnaireTab/Query/Fragments";
import {orgs_fragment,} from "graphql/Fragments";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findOneContractorQuestionnaireQuery {
        default_contractor_questionnaires(
          where: {id: {_eq: ${input}},},
        ) {
            ${contractor_questionnaire_details_fragment}
            ${orgs_fragment}
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}