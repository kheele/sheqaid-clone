/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntitySite} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdSiteQuery($id: bigint) {
    default_sites_connection(where: {id: {_eq: $id}}) {
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
    input && findOneMutationImpl({ query, variables: {id: input} });
