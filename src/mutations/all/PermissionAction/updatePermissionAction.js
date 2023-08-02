/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityPermissionAction} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updatePermissionActionMutation($id: sheq_permissions_actions_pk_columns_input!, $_set: sheq_permissions_actions_set_input!) {
    update_sheq_permissions_actions_by_pk(pk_columns: $id, _set: $_set) {
      id
      create
      edit
      view
      remove
      share
    }
  }
`;

// 3
export default async (attrs: EntityPermissionAction) =>
  updateMutationImpl({
    mutation,
      id: attrs.id,
      attrs,
  });
