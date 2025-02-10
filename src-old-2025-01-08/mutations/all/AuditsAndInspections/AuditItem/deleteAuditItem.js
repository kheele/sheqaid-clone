/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdAuditItem from "./findByIdAuditItem";

const mutation = graphql`
  mutation deleteAuditItemMutation($id: bigint!) {
    delete_sheq_compliance_audits_items_by_pk(id: $id) {
      id
    }
  }
`;

export default async (id) => {
  const item = await findByIdAuditItem(id);
  if (!item) return;
  
  return updateMutationImpl({
    mutation,
    id,
  });
};
