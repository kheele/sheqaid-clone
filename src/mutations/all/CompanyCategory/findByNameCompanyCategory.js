/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityCompanyCategory} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByNameCompanyCategoryQuery($name: String) {
    default_company_categories_connection(where: {name: {_eq: $name}}) {
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
export default (input: string) =>
    input && findOneMutationImpl({ query, variables: {name: input} });
