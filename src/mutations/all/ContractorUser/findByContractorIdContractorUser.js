/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityContractorUser} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByContractorIdContractorUserQuery($contractor_id: bigint) {
    default_contractor_users_connection(where: {contractor_id: {_eq: $contractor_id}}) {
      edges {
        node {
          id
          auth_id
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {contractor_id: input} });
