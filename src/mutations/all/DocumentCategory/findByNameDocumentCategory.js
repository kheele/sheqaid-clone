/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityDocumentCategory} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByNameDocumentCategoryQuery($name: String) {
    default_document_categories_connection(where: {name: {_eq: $name}}) {
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
