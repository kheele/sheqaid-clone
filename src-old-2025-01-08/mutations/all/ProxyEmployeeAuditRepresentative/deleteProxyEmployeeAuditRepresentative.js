/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdProxyEmployeeAuditRepresentative from "./findByIdProxyEmployeeAuditRepresentative";

const mutation = graphql`
  mutation deleteProxyEmployeeAuditRepresentativeMutation($id: bigint!) {
    delete_proxy_employee__audit_representative_by_pk(id: $id) {
      id
    }
  }
`;

export default async (id) => {
  const item = await findByIdProxyEmployeeAuditRepresentative(id);
  if (!item) return;
  
  return updateMutationImpl({
    mutation,
    id,
  });
};
