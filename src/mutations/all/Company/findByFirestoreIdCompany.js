/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityCompany} from "../../types.d.ts";

// 2
const query = graphql`
  query findByFirestoreIdCompanyQuery($firestore_id: String) {
    default_companies_connection(where: {firestore_id: {_eq: $firestore_id}}) {
      edges {
        node {
          id
          created_at
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: string) =>
    findOneMutationImpl({ query, variables: {firestore_id: input} });
