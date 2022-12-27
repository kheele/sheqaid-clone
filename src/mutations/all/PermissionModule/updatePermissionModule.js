/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityPermissionModule} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updatePermissionModuleMutation($id: sheq_permissions_modules_pk_columns_input!, $_set: sheq_permissions_modules_set_input!) {
    update_sheq_permissions_modules_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityPermissionModule) =>
  updateMutationImpl({
    mutation,
      id: attrs.id,
      attrs,
  });
