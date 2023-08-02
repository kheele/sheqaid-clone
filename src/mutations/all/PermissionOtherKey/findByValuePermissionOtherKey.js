/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntitySite} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByValuePermissionOtherKeyQuery($value: String) {
    sheq_permissions_other_keys_connection(where: {value: {_eq: $value}}) {
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
    input && findOneMutationImpl({ query, variables: {value: input} });
