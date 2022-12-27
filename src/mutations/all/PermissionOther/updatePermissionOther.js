/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityPermissionOther} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updatePermissionOtherMutation($id: sheq_permissions_other_pk_columns_input!, $_set: sheq_permissions_other_set_input!) {
    update_sheq_permissions_other_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityPermissionOther) =>
  updateMutationImpl({
    mutation,
      id: attrs.id,
      attrs,
  });
