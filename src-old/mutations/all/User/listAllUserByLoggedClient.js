/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

//offset = (pageNum - 1) * limit;
// 2
export const query = graphql`
  query listAllUserByLoggedClientQuery($page_size: Int, $client_id: bigint) {
    default_users_connection(first: $page_size, where: {client_id: {_eq: $client_id}}) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...UserFragment
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (page_size: number = 30, input: number) =>
    listMutationImpl({ query, variables: {page_size, client_id: input} });
