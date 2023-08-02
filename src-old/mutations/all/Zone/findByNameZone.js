/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityDepartment} from "../../types.d.ts";

// 2
const query = graphql`
  query findByNameZoneQuery($name: String) {
    default_zones_connection(where: {name: {_eq: $name}}) {
      edges {
        node {
          id
          country {
            id
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: string) =>
    input && findOneMutationImpl({ query, variables: {name: input} });
