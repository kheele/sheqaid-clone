/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityDocumentCategory} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateDocumentCategoryMutation($id: default_document_categories_pk_columns_input!, $_set: default_document_categories_set_input!) {
    update_default_document_categories_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityDocumentCategory) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
