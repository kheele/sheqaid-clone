/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityContractorsQuestionnaire} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdContractorsQuestionnaire from "./findByIdContractorsQuestionnaire";

// 2
const mutation = graphql`
  mutation insertContractorsQuestionnaireMutation($object: default_contractor_questionnaires_insert_input!) {
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
    input: {is_template: false, group: "Contractors", ...input}
  });
  if (res) {
    return findByIdContractorsQuestionnaire(res.id);
  }

  return res;
};
