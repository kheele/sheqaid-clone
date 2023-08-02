/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeMedical} from "mutations/types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeMedical from "./updateEmployeeMedical";

// 2
const mutation = graphql`
  mutation insertEmployeeMedicalMutation($object: hr_employees_docs_medicals_insert_input!) {
    insert_hr_employees_docs_medicals_one(
      object: $object
    ) {
      id
      created_at
      annexture_3
      restrictions
      doc
      expiry_date
      expiry_updated
      removed
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
export default async (input: EntityEmployeeMedical) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeMedical,
  name: 'Medical',
  plural: 'medicals',
});
