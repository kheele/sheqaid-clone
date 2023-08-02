/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityInspectionsQuestionnaire} from "mutations/types.d.ts";
import findByIdInspectionsQuestionnaire from "./findByIdInspectionsQuestionnaire";

// 2
const mutation = graphql`
  mutation updateInspectionsQuestionnaireMutation($id: default_contractor_questionnaires_pk_columns_input!, $_set: default_contractor_questionnaires_set_input!) {
    update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityInspectionsQuestionnaire) => {
  const {

  } = attrs;

  return updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  }).then(res => res && findByIdInspectionsQuestionnaire(res.id));
};