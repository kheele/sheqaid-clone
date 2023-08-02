/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeCounselling} from "mutations/types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeCounselling from "./findByIdEmployeeCounselling";

// 2
const mutation = graphql`
  mutation updateEmployeeCounsellingMutation($id: hr_employees_docs_counsellings_pk_columns_input!, $_set: hr_employees_docs_counsellings_set_input!) {
    update_hr_employees_docs_counsellings_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        doc
        corrective_actions
        counselling_hrs_to_complete
        expiry_date
        expiry_updated
        removed
        incident_desc
        reasons
        types
        responsible_person{
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
export default async (attrs: EntityEmployeeCounselling) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeCounselling,
    name: 'Counselling',
    plural: 'counsellings',
});
