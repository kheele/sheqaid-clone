/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeLeave} from "../../types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeLeave from "./updateEmployeeLeave";

// 2
const mutation = graphql`
  mutation insertEmployeeLeaveMutation($object: hr_employees_docs_leaves_insert_input!) {
    insert_hr_employees_docs_leaves_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityEmployeeLeave) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeLeave,
  name: 'Leave',
  plural: 'leaves',
});
