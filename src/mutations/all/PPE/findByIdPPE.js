/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityPPE} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdPPEQuery($id: bigint) {
    ppe_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          name
          unit
          qty_received
          qty_issued
          qty_in_stock
          duration_type
          duration_value
          notes
          profile_pic

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

          team_list_aggregate{
            aggregate {
              count
            }
          }
          department_list_aggregate{
            aggregate {
              count
            }
          }
          job_position_list_aggregate{
            aggregate {
              count
            }
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
