/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityTeam} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllTeamByPPEQuery($ppe_type_id: bigint) {
    default_teams_connection(where: {ppe_type_list: {ppe_type_id: {_eq: $ppe_type_id}}}, order_by: {name: asc}) {
      edges {
        node {
          id
          created_at
          name
          status

          supervisor {
            id
            fname
            lname
            email
            phone
            job_position{
              id
              name
            }
          }

          client {
            id
            name
          }
          project {
            id
            name
          }
          site {
            id
            name
          }

          employee_list_aggregate{
            aggregate{
              count
            }
          }
          ppe_type_list_aggregate{
            aggregate{
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
export default async (input: number) : [EntityTeam] =>
    listMutationImpl({ query, variables: {ppe_type_id: input} });
