/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeLicense} from "../../types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeLicense from "./updateEmployeeLicense";

// 2
const mutation = graphql`
  mutation insertEmployeeLicenseMutation($object: hr_employees_docs_licenses_insert_input!) {
    insert_hr_employees_docs_licenses_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityEmployeeLicense) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeLicense,
  name: 'License',
  plural: 'licenses',
});
