/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityContractorsQuestionnaire} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdContractorsQuestionnaireLibrary from "./findByIdContractorsQuestionnaireLibrary";

// 2
const mutation = graphql`
  mutation insertContractorsQuestionnaireLibraryMutation($object: default_contractor_questionnaires_insert_input!) {
    insert_default_contractor_questionnaires_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityContractorsQuestionnaire) => {
  const {

  } = input;

  crudUtils.injectCreate(input);

  const res = await createMutationImpl({
    mutation,
    input: {is_template: true, group: "Contractors", ...input}
  });
  if (res) {
    return findByIdContractorsQuestionnaireLibrary(res.id);
  }

  return res;
};
