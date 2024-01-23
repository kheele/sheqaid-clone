/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAuditDefinition from "./findByIdAuditDefinition";

const mutation = graphql`
  mutation deleteAuditDefinitionMutation($id: bigint!) {
    delete_sheq_compliance_audits_definitions_by_pk(id: $id) {
      id
    }
  }
`;

export default async (id) => {
  const item = await findByIdAuditDefinition(id);
  if (!item) return;
  
  return updateMutationImpl({
    mutation,
    id,
  });
};
