/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdAuditDefinition from "./findByIdAuditDefinition";

// 2
const mutation = graphql`
  mutation insertAuditDefinitionMutation($object: sheq_compliance_audits_definitions_insert_input!) {
    insert_sheq_compliance_audits_definitions_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityAudit) =>  {
  const {
  } = input;

  const res = await createMutationImpl({mutation, input});
  if(res) {
   return findByIdAuditDefinition(res.id);
  }
};
