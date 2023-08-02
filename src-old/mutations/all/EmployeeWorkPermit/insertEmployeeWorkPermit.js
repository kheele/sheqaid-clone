/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeWorkPermit} from "../../types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeWorkPermit from "./updateEmployeeWorkPermit";

// 2
const mutation = graphql`
  mutation insertEmployeeWorkPermitMutation($object: hr_employees_docs_work_permits_insert_input!) {
    insert_hr_employees_docs_work_permits_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityEmployeeWorkPermit) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeWorkPermit,
  name: 'Work-Permit',
  plural: 'work-permits',
});
