/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllJobCategoryByLoggedClientQuery($client_id: bigint) {
    default_job_categories_connection(where: {client_id: {_eq: $client_id}}, order_by: {name: asc}) {
      edges {
        node {
          id
          created_at
          name
          job_category_owner
          job_position_list_aggregate{
            aggregate{
              count
            }
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
    listMutationImpl({ query, variables: {client_id: input} });
