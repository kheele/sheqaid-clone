/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityPermissionAction} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertPermissionActionMutation($object: sheq_permissions_actions_insert_input!) {
    insert_sheq_permissions_actions_one(
      object: $object
    ) {
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
export default async (input: EntityPermissionAction) =>
  createMutationImpl({ mutation, input });
