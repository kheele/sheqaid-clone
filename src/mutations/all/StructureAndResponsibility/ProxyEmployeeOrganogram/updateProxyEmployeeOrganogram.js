/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityProxyEmployeeOrganogram} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxyEmployeeOrganogramMutation($id: proxy_employee__organogram_pk_columns_input!, $_set: proxy_employee__organogram_set_input!) {
    update_proxy_employee__organogram_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityProxyEmployeeOrganogram) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
