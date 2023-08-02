/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityDepartment} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByNameCityQuery($name: String) {
    default_cities_connection(where: {name: {_eq: $name}}) {
      edges {
        node {
          id
          zone {
            id
          }
          country {
            id
          }
        }
      }
    }
  }
`;
// 3
export default async (input: string) =>
    input && findOneMutationImpl({ query, variables: {name: input} });
