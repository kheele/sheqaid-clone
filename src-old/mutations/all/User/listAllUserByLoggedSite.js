/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllUserByLoggedSiteQuery($site_id: bigint) {
    default_users_connection(where: {site_id: {_eq: $site_id}}) {
      edges {
        node {
          ...UserFragment
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: number) =>
    listMutationImpl({ query, variables: {site_id: input} });
