/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityJobCategory} from "../../types.d.ts";

// 2
const query = graphql`
  query findByNameJobCategoryQuery($name: String, $client_id: bigint) {
    default_job_categories_connection(where: {name: {_eq: $name}, client_id: {_eq: $client_id}}) {
      edges {
        node {
          id
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: string, client_id: number) =>
    input && findOneMutationImpl({ query, variables: {name: input, client_id} });
