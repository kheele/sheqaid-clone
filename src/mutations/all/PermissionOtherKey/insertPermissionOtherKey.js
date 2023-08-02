/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityPermissionOtherKey} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertPermissionOtherKeyMutation($object: sheq_permissions_other_keys_insert_input!) {
    insert_sheq_permissions_other_keys_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityPermissionOtherKey) =>
  createMutationImpl({ mutation, input });
