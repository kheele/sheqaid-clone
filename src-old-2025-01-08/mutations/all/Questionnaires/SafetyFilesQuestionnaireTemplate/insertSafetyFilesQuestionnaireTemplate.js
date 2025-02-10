/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySafetyFilesQuestionnaire} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdSafetyFilesQuestionnaireTemplate from "./findByIdSafetyFilesQuestionnaireTemplate";

// 2
const mutation = graphql`
  mutation insertSafetyFilesQuestionnaireTemplateMutation($object: default_contractor_questionnaires_insert_input!) {
    insert_default_contractor_questionnaires_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntitySafetyFilesQuestionnaire) => {
  const {

  } = input;

  crudUtils.injectCreate(input);

  const res = await createMutationImpl({
    mutation,
    input: {is_template: true, answered_by: "Sender", group: "Safety Files", ...input}
  });
  if (res) {
    return findByIdSafetyFilesQuestionnaireTemplate(res.id);
  }

  return res;
};
