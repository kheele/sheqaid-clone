/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityClaimsProviderRequest} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByFirestoreIdClaimsProviderRequestQuery($firestore_id: String) {
    coida_claims_coid_provider_requests_connection(where: {firestore_id: {_eq: $firestore_id}}) {
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
