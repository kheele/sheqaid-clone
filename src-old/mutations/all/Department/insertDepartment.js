/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityDepartment} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertDepartmentMutation($object: default_departments_insert_input!) {
    insert_default_departments_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityDepartment) =>
  createMutationImpl({ mutation, input });
