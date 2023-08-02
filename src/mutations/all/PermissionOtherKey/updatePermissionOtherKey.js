/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityPermissionOtherKey} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updatePermissionOtherKeyMutation($id: sheq_permissions_other_keys_pk_columns_input!, $_set: sheq_permissions_other_keys_set_input!) {
    update_sheq_permissions_other_keys_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityPermissionOtherKey) =>
  updateMutationImpl({
    mutation,
      id: attrs.id,
      attrs,
  });
