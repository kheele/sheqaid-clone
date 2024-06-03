/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeWarning} from "mutations/types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeWarning from "./findByIdEmployeeWarning";

// 2
const mutation = graphql`
  mutation updateEmployeeWarningMutation($id: hr_employees_docs_warnings_pk_columns_input!, $_set: hr_employees_docs_warnings_set_input!) {
    update_hr_employees_docs_warnings_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityEmployeeWarning) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeWarning,
    name: 'Warning',
    plural: 'warnings',
});
