/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityJobPosition} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdJobPositionQuery($id: bigint) {
    default_job_positions_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          name
          desc
          doc
          job_position_owner
          employee_list_aggregate{
            aggregate{
              count
            }
          }
          employee_external_list_aggregate{
            aggregate{
              count
            }
          }
          ppe_list_aggregate{
            aggregate{
              count
            }
          }
          toolbox_talk_list_aggregate{
            aggregate{
              count
            }
          }
          training_plan_list_aggregate{
            aggregate{
              count
            }
          }
          job_category {
            id
            name
          }
          company{
            id
            name
          }
          client{
            id
            name
          }
          project{
            id
            name
          }
          site{
            id
            name
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
