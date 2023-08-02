/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";
import {
  inspection_question_list_fragment
} from "views/plugins/plugin_sheq_assist/Inspections/InspectionTab/Query/Fragments";
import {orgs_fragment} from "graphql/Fragments";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findOneQuestionQuery {
        default_contractor_questionnaires_ques(
          where: {id: {_eq: ${input}},},
        ) {
            ${inspection_question_list_fragment(3)}
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}