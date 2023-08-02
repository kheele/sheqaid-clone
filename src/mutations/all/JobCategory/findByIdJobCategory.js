/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityJobCategory} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdJobCategoryQuery($id: bigint) {
    default_job_categories_connection(where: {id: {_eq: $id}}) {
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
    findOneMutationImpl({ query, variables: {id: input} });
