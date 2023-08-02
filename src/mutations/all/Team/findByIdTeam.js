/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTeam} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdTeamQuery($id: bigint) {
    default_teams_connection(where: {id: {_eq: $id}}) {
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
          ppe_list_aggregate{
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
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
