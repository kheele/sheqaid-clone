/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityPPE} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllPPEByTeamQuery($team_id: bigint) {
    ppe_connection(where: {team_list: {team_id: {_eq: $team_id}}}) {
      edges {
        node {
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
export default async (input: number) : [EntityPPE] =>
    listMutationImpl({ query, variables: {team_id: input} });
