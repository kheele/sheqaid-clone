/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityDocumentCategory} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertDocumentCategoryMutation($object: default_document_categories_insert_input!) {
    insert_default_document_categories_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityDocumentCategory) =>
  createMutationImpl({ mutation, input });
