/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityModule} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertModuleMutation($object: default_manager_module_insert_input!) {
    insert_default_manager_module_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityModule) =>
  createMutationImpl({ mutation, input });
