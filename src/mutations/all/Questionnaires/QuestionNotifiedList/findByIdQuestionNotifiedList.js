/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";

export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findOneQuestionNotifiedListQuery {
        proxy_contractor_questionnaires__notified(
          where: {id: {_eq: ${input}},},
        ) {
            id
            question_id
            employee_id
            ques{
		            id
            }
            employee{
              id
              fname
              lname
              full_name
              email
              phone
              job_position{
                id
                name
              }
              department{
                id
                name
              }
            }
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}
