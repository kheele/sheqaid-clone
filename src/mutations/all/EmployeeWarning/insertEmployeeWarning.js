/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeWarning} from "mutations/types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeWarning from "./updateEmployeeWarning";

// 2
const mutation = graphql`
  mutation insertEmployeeWarningMutation($object: hr_employees_docs_warnings_insert_input!) {
    insert_hr_employees_docs_warnings_one(
      object: $object
    ) {
      id
      created_at
      doc
      type
      category_of_misconduct
      date
      expiry_date
      expiry_updated
      removed
      details
      employee_comments
      notes
      witness_list{
        id
        witness{
          fname
          lname
          phone
          email
          id_num
          passport_num
        }
      }
      issued_by{
        id
        fname
        lname
        phone
        email
        id_num
        passport_num
      }
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
export default async (input: EntityEmployeeWarning) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeWarning,
  name: 'Warning',
  plural: 'warnings',
});
