/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityContractorUser} from "../../types.d.ts";

// 2
const query = graphql`
  query findByFirestoreIdContractorUserQuery($firestore_id: String) {
    default_contractor_users_connection(where: {auth_id: {_eq: $firestore_id}}) {
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
export default (input: string) =>
    input && findOneMutationImpl({ query, variables: {firestore_id: input} });
