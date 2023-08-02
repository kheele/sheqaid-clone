/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityPlugin} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updatePluginMutation($id: default_manager_plugin_pk_columns_input!, $_set: default_manager_plugin_set_input!) {
    update_default_manager_plugin_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityPlugin) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
