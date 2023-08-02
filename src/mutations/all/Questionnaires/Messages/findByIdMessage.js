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
      query findOneMessageQuery {
        default_contractor_questionnaires_messages(
          where: {id: {_eq: ${input}},},
        ) {
            id
            question_id
            date
            msg
            read
            sender_id
            recipient_id
            contractor_sender_id
            contractor_recipient_id
            sender{
              id
              full_name
              username
            }
            recipient{
              id
              full_name
              username
            }
            contractor_sender{
              id
              full_name
              username
            }
            contractor_recipient{
              id
              full_name
              username
            }
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}