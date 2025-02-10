/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
    mutation insertEmployeeExternalMutation($object: hr_employees_external_insert_input!) {
        insert_hr_employees_external_one(
            object: $object
        ) {
            id
            created_at
            is_external
            fname
            lname
            full_name
            email
            phone
            id_num
            passport_num
            job_position {
                id
                name
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
export default async (input: EntityEmployee) => {
	const {
		email,
		phone,
	} = input;
	//
	// let existingUser = await findByEmailEmployee(email);
	// if (existingUser) {
	// 	return "EMAIL_DUP";
	// }
	// existingUser = await findByPhoneEmployee(phone);
	// if (existingUser) {
	// 	return "PHONE_DUP";
	// }

	crudUtils.injectCreate(input);

	const res = await createMutationImpl({mutation, input});
	return res;
};
