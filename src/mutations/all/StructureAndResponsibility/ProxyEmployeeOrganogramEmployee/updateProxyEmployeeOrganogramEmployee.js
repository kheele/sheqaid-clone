/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityProxyEmployeeOrganogramEmployee} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxyEmployeeOrganogramEmployeeMutation($id: proxy_employee__organogram__employees_pk_columns_input!, $_set: proxy_employee__organogram__employees_set_input!) {
    update_proxy_employee__organogram__employees_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityProxyEmployeeOrganogramEmployee) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
