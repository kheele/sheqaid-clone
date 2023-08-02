/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {EntityEmployeeCompetency} from "../../types.d.ts";
import updateEmployeeCompetency from "./updateEmployeeCompetency";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";

// 2
const mutation = graphql`
    mutation insertEmployeeCompetencyMutation($object: hr_employees_docs_competencies_insert_input!) {
        insert_hr_employees_docs_competencies_one(
            object: $object
        ) {
            id
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
