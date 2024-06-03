/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeLeave} from "mutations/types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeLeave from "./updateEmployeeLeave";

// 2
const mutation = graphql`
  mutation insertEmployeeLeaveMutation($object: hr_employees_docs_leaves_insert_input!) {
    insert_hr_employees_docs_leaves_one(
      object: $object
    ) {
      id
      created_at
      doc
      doc_fitness_certificate
      days_booked
      due_to
      date
      expiry_date
      expiry_updated
      removed
      employee_comments
      type
      notes
      reason
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
export default async (input: EntityEmployeeLeave) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeLeave,
  name: 'Leave',
  plural: 'leaves',
});
