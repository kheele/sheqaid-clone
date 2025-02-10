/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllContractorUserByLoggedContractorQuery($contractor_id: bigint) {
    default_contractor_users_connection(where: {contractor_id: {_eq: $contractor_id}}) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
#          ...UserFragment
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    listMutationImpl({ query, variables: {contractor_id: input} });
