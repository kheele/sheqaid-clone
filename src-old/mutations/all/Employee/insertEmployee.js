/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityEmployee} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertEmployeeMutation($object: hr_employees_insert_input!) {
    insert_hr_employees_one(
      object: $object
    ) {
      ...EmployeeFragment
    }
  }
`;

// 3
export default (input: EntityEmployee) =>
  createMutationImpl({ mutation, input });
