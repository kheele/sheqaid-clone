/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityJobObservationsQuestionnaire} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdJobObservationsQuestionnaireTemplate from "./findByIdJobObservationsQuestionnaireTemplate";

// 2
const mutation = graphql`
  mutation insertJobObservationsQuestionnaireTemplateMutation($object: default_contractor_questionnaires_insert_input!) {
    insert_default_contractor_questionnaires_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityJobObservationsQuestionnaire) => {
  const {

  } = input;

  crudUtils.injectCreate(input);

  const res = await createMutationImpl({
    mutation,
    input: {is_template: true, answered_by: "Sender", group: "Job Observations", ...input}
  });
  if (res) {
    return findByIdJobObservationsQuestionnaireTemplate(res.id);
  }

  return res;
};
