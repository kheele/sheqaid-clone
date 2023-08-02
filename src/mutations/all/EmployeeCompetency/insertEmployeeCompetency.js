/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {EntityEmployeeCompetency} from "mutations/types.d.ts";
import updateEmployeeCompetency from "./updateEmployeeCompetency";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";

// 2
const mutation = graphql`
    mutation insertEmployeeCompetencyMutation($object: hr_employees_docs_competencies_insert_input!) {
        insert_hr_employees_docs_competencies_one(
            object: $object
        ) {
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
export default async (input: EntityEmployeeCompetency) => insertEmployeeDocImpl({
    mutation,
    input,
    updateEmployeeDocFn: updateEmployeeCompetency,
    name: 'Competency-Certificate',
    plural: 'competencies',
});
