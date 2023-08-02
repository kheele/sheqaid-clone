/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeMedical} from "mutations/types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeMedical from "./findByIdEmployeeMedical";

// 2
const mutation = graphql`
  mutation updateEmployeeMedicalMutation($id: hr_employees_docs_medicals_pk_columns_input!, $_set: hr_employees_docs_medicals_set_input!) {
    update_hr_employees_docs_medicals_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityEmployeeMedical) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeMedical,
    name: 'Medical',
    plural: 'medicals',
});