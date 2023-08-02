/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityUser} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateUserMutation($id: default_users_pk_columns_input!, $_set: default_users_set_input!) {
    update_default_users_by_pk(pk_columns: $id, _set: $_set) {
      ...UserFragment
    }
  }
`;

// 3
export default (attrs: EntityUser) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
