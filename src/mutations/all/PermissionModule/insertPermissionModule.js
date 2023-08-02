/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityPermissionModule} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertPermissionModuleMutation($object: sheq_permissions_modules_insert_input!) {
    insert_sheq_permissions_modules_one(
      object: $object
    ) {
      id
      actions{
        id
        create
        edit
        view
        remove
        share
      }
      module{
        id
        key
        title
        plugin{
          id
          key
          desc
          status
          title
        }
      }
    }
  }
`;

// 3
export default async (input: EntityPermissionModule) =>
  createMutationImpl({ mutation, input });
