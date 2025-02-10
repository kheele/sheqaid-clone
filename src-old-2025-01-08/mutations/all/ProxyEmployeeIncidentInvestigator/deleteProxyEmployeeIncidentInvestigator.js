/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdProxyEmployeeIncidentInvestigator from "./findByIdProxyEmployeeIncidentInvestigator";

const mutation = graphql`
  mutation deleteProxyEmployeeIncidentInvestigatorMutation($id: bigint!) {
    delete_proxy_incident__investigator_by_pk(id: $id) {
      id
    }
  }
`;

export default async (id) => {
  const item = await findByIdProxyEmployeeIncidentInvestigator(id);
  if (!item) return;
  
  return updateMutationImpl({
    mutation,
    id,
  });
};
