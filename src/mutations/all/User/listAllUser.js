/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllUserQuery {
    default_users_connection {
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
export default async () =>
    listMutationImpl({ query });
