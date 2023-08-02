/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityInspectionsQuestionnaire} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdInspectionsQuestionnaireTemplate from "./findByIdInspectionsQuestionnaireTemplate";

// 2
const mutation = graphql`
  mutation insertInspectionsQuestionnaireTemplateMutation($object: default_contractor_questionnaires_insert_input!) {
    insert_default_contractor_questionnaires_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityInspectionsQuestionnaire) => {
  const {

  } = input;

  crudUtils.injectCreate(input);

  const res = await createMutationImpl({
    mutation,
    input: {is_template: true, answered_by: "Sender", group: "Inspections", ...input}
  });
  if (res) {
    return findByIdInspectionsQuestionnaireTemplate(res.id);
  }

  return res;
};
