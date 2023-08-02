/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeMedical} from "../../types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeMedical from "./updateEmployeeMedical";

// 2
const mutation = graphql`
  mutation insertEmployeeMedicalMutation($object: hr_employees_docs_medicals_insert_input!) {
    insert_hr_employees_docs_medicals_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityEmployeeMedical) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeMedical,
  name: 'Medical',
  plural: 'medicals',
});
