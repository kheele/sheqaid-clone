/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntitySite} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByKeyModuleQuery($key: String) {
    default_manager_module_connection(where: {key: {_eq: $key}}) {
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
    input && findOneMutationImpl({ query, variables: {key: input} });
