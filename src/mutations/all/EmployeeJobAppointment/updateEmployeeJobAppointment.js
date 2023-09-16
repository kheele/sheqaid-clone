/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeJobAppointment} from "mutations/types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeJobAppointment from "./findByIdEmployeeJobAppointment";

// 2
const mutation = graphql`
  mutation updateEmployeeJobAppointmentMutation($id: hr_employees_docs_job_appointments_pk_columns_input!, $_set: hr_employees_docs_job_appointments_set_input!) {
    update_hr_employees_docs_job_appointments_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityEmployeeJobAppointment) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeJobAppointment,
    name: 'Job-Appointment',
    plural: 'job_appointments',
});
