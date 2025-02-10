/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdProxyEmployeeAuditor from "./findByIdProxyEmployeeAuditor";

const mutation = graphql`
  mutation deleteProxyEmployeeAuditorMutation($id: bigint!) {
    delete_proxy_employee__auditor_by_pk(id: $id) {
      id
    }
  }
`;

export default async (id) => {
  const item = await findByIdProxyEmployeeAuditor(id);
  if (!item) return;
  
  return updateMutationImpl({
    mutation,
    id,
  });
};
