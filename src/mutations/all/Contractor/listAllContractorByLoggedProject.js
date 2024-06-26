/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllSiteByLoggedProjectQuery($project_id: bigint) {
    default_sites_connection(where: {project_id: {_eq: $project_id}}, order_by: {name: asc}) {
      edges {
        node {
          id
          created_at
          name
          address
          project{
            id
            name
          }
          client{
            id
            name
          }
          contractor_site_user_list_aggregate {
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
    listMutationImpl({ query, variables: {project_id: input} });
