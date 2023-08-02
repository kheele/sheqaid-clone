/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityEmployeeCompetency} from "mutations/types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeCompetency from "./findByIdEmployeeCompetency";

// 2
const mutation = graphql`
  mutation updateEmployeeCompetencyMutation($id: hr_employees_docs_competencies_pk_columns_input!, $_set: hr_employees_docs_competencies_set_input!) {
    update_hr_employees_docs_competencies_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        accreditation_num
        competency_type
        type
        doc
        issued_date
        expiry_date
        expiry_updated
        employee{
            id
            fname
            lname
            phone
            email
            id_num
            passport_num
            competency_list{
                id
                expiry_date
            }
        }
        training{
            id
            course{
                id
                name
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
export default async (attrs: EntityEmployeeCompetency) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeCompetency,
    name: 'Competency-Certificate',
    plural: 'competencies',
});
