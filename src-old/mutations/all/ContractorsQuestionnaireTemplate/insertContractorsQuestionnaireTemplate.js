/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityContractorsQuestionnaireTemplate} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertContractorsQuestionnaireTemplateMutation($object: default_contractor_questionnaire_templates_insert_input!) {
    insert_default_contractor_questionnaire_templates_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityContractorsQuestionnaireTemplate) =>
  createMutationImpl({ mutation, input });
