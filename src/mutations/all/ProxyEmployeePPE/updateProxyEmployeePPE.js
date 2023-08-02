/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityEmployeePPE} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxyEmployeePPEMutation($id: proxy_employee__ppe_pk_columns_input!, $_set: proxy_employee__ppe_set_input!) {
    update_proxy_employee__ppe_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityEmployeePPE) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
