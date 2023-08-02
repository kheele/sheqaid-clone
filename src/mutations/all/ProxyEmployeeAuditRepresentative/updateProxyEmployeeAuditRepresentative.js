/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityProxyEmployeeAuditRepresentative} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxyEmployeeAuditRepresentativeMutation($id: proxy_employee__audit_representative_pk_columns_input!, $_set: proxy_employee__audit_representative_set_input!) {
    update_proxy_employee__audit_representative_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityProxyEmployeeAuditRepresentative) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
