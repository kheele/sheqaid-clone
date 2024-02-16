/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityDepartmentPPE} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxyDepartmentPPEMutation($id: proxy_department__ppe_type_pk_columns_input!, $_set: proxy_department__ppe_type_set_input!) {
    update_proxy_department__ppe_type_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityDepartmentPPE) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
