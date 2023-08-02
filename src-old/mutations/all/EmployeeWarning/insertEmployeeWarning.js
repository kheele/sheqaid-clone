/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeWarning} from "../../types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeWarning from "./updateEmployeeWarning";

// 2
const mutation = graphql`
  mutation insertEmployeeWarningMutation($object: hr_employees_docs_warnings_insert_input!) {
    insert_hr_employees_docs_warnings_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityEmployeeWarning) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeWarning,
  name: 'Warning',
  plural: 'warnings',
});
