/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {EntityEmployeeNextOfKin} from "mutations/types.d.ts";
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertEmployeeNextOfKinMutation($object: hr_employees_next_of_kin_insert_input!) {
        insert_hr_employees_next_of_kin_one(
            object: $object
        ) {
            id
            created_at
            fname
            lname
            phone1
            phone2
            relationship
            employee_id
            employee{
                id
            }
        }
    }
`;

// 3
export default async (input: EntityEmployeeNextOfKin) => {
    const {
        fname,
        lname,
        phone1,
        phone2,
        relationship,
        employee_id,
    } = input;

    return createMutationImpl({mutation, input});
};
