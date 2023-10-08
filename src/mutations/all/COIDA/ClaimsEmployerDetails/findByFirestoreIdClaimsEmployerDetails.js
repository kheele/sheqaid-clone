/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityClaimsEmployerDetails} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByFirestoreIdClaimsEmployerDetailsQuery($firestore_id: String) {
    coida_claims_employer_details_connection(where: {firestore_id: {_eq: $firestore_id}}) {
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
export default async (input: string) =>
    input && findOneMutationImpl({ query, variables: {firestore_id: input} });
