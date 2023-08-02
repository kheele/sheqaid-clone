/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "../../types.d.ts";

// 2
const query = graphql`
  query findByIdUserQuery($id: bigint) {
    default_users_connection(where: {id: {_eq: $id}}) {
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
    findOneMutationImpl({ query, variables: {id: input} });
