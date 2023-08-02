/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityModule} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateModuleMutation($id: default_manager_module_pk_columns_input!, $_set: default_manager_module_set_input!) {
    update_default_manager_module_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityModule) =>
  updateMutationImpl({
    mutation,
      id: attrs.id,
      attrs,
  });
