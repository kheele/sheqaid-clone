/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeJobAppointment} from "mutations/types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeJobAppointment from "./updateEmployeeJobAppointment";

// 2
const mutation = graphql`
  mutation insertEmployeeJobAppointmentMutation($object: hr_employees_docs_job_appointments_insert_input!) {
    insert_hr_employees_docs_job_appointments_one(
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
export default async (input: EntityEmployeeJobAppointment) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeJobAppointment,
  name: 'JobAppointment',
  plural: 'job_appointments',
});
