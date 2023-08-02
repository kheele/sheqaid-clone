/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeLicense} from "mutations/types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeLicense from "./findByIdEmployeeLicense";

// 2
const mutation = graphql`
  mutation updateEmployeeLicenseMutation($id: hr_employees_docs_licenses_pk_columns_input!, $_set: hr_employees_docs_licenses_set_input!) {
    update_hr_employees_docs_licenses_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityEmployeeLicense) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeLicense,
    name: 'License',
    plural: 'licenses',
});
