/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityPermissionOther} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertPermissionOtherMutation($object: sheq_permissions_other_insert_input!) {
    insert_sheq_permissions_other_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityPermissionOther) =>
  createMutationImpl({ mutation, input });
