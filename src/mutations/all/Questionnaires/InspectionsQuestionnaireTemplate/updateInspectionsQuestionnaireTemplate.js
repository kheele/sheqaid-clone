/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityInspectionsQuestionnaire} from "mutations/types.d.ts";
import findByIdInspectionsQuestionnaireTemplate from "./findByIdInspectionsQuestionnaireTemplate";

const mutation = graphql`
  mutation updateInspectionsQuestionnaireTemplateMutation($id: default_contractor_questionnaires_pk_columns_input!, $_set: default_contractor_questionnaires_set_input!) {
    update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

export default async (attrs: EntityInspectionsQuestionnaire) =>  {
  const {} = attrs;

  return updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  }).then(res => res && findByIdInspectionsQuestionnaireTemplate(res.id));
};