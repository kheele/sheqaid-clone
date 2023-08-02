/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {EntityEmployeeDependant} from "mutations/types.d.ts";
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertEmployeeDependantMutation($object: hr_employees_dependents_insert_input!) {
        insert_hr_employees_dependents_one(
            object: $object
        ) {
            id
            created_at
            fname
            lname
            dob
            gender
            employee_id
            employee{
                id
            }
        }
    }
`;

// 3
export default async (input: EntityEmployeeDependant) => {
    const {
        fname,
        lname,
        gender,
        dob,
        employee_id,
    } = input;

    return createMutationImpl({mutation, input});
};
