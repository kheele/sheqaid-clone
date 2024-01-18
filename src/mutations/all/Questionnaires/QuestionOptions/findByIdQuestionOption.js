/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";

export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findOneQuestionOptionQuery {
        default_contractor_questionnaires_ques_options(
          where: {id: {_eq: ${input}},},
        ) {
            id
            answer
            optionImage
            optionText
            optionType
            ques{
		            id
            }
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}
