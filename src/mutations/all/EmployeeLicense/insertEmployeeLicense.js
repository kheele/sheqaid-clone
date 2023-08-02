/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeLicense} from "mutations/types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeLicense from "./updateEmployeeLicense";

// 2
const mutation = graphql`
  mutation insertEmployeeLicenseMutation($object: hr_employees_docs_licenses_insert_input!) {
    insert_hr_employees_docs_licenses_one(
      object: $object
    ) {
      id
      created_at
      doc
      date
      expiry_date
      expiry_updated
      removed
      notes
      employee{
        id
        fname
        lname
        phone
        email
        id_num
        passport_num
      }
      company {
        id
        name
      }
      client {
        id
        name
      }
      project {
        id
        name
      }
      site {
        id
        name
      }
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
