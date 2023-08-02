/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByPhoneDuplicateUserQuery($id: bigint, $username: String) {
      default_users_connection(where: {id: {_neq: $id}, phone: {_eq: $username}}) {
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
export default async ({id, phone: input}) =>
    input && findOneMutationImpl({checkLogin: false, query, variables: {id, username: input} });
