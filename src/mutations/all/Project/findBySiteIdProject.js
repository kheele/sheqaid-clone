/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityProject} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findBySiteIdProjectQuery($id: bigint) {
    default_projects_connection(where: {site_list: {id: {_eq: $id}}}) {
      edges {
        node {
          id
          created_at
          name
          address
          client{
            id
            name
          }
          site_list{
            id
            name
          }
          site_list_aggregate {
            aggregate {
              count
            }
          }
          contractor_list_aggregate {
            aggregate {
              count
            }
          }
          user_list_aggregate {
            aggregate {
              count
            }
          }
          employee_list_aggregate {
            aggregate {
              count
            }
          }
          team_list_aggregate {
            aggregate {
              count
            }
          }
          incident_list_aggregate {
            aggregate {
              count
            }
          }
          training_matrix_list_aggregate {
            aggregate {
              count
            }
          }
          asset_list_aggregate {
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
