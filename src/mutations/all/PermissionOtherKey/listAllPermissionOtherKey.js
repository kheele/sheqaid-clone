/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllPermissionOtherKeyQuery {
    sheq_permissions_other_keys_connection(order_by: {value: asc}) {
      edges {
        node {
          id
          value
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async () =>
    listMutationImpl({checkLogin: false, query });
