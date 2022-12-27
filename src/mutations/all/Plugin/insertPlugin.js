/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityPlugin} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertPluginMutation($object: default_manager_plugin_insert_input!) {
    insert_default_manager_plugin_one(
      object: $object
#      on_conflict: { constraint: default_manager_plugin_pkey, update_columns: [key, title] }
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityPlugin) =>
  createMutationImpl({ mutation, input });
