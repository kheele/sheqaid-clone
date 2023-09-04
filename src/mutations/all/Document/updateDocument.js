/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityDocument} from "mutations/types.d.ts";
import findByIdDocument from "./findByIdDocument";

// 2
const mutation = graphql`
  mutation updateDocumentMutation($id: sheq_documents_pk_columns_input!, $_set: sheq_documents_set_input!) {
    update_sheq_documents_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityDocument) => {
  const {
    id,
    doc_type,
    //0
    client_id,
    project_id,
    site_id,
    //1
    responsible_department_id,
    responsible_person_id,
    expiry,
    internal_or_external,
    category_id,
    desc,
    //2
    title,
    doc_version_list,//[{type,expiry,doc,doc_docs_id,doc_num}]
  } = attrs;

  const existingItem = await findByIdDocument(id);
  if(!existingItem) {
    return "NOT_FOUND";
  }

  return updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  }).then(res => res && findByIdDocument(res.id));
};