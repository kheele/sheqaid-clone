/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityDocument} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateDocumentMutation($id: sheq_documents_pk_columns_input!, $_set: sheq_documents_set_input!) {
    update_sheq_documents_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityDocument) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
