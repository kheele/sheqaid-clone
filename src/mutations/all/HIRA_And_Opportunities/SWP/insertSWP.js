/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySWP} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdSWP from "./findByIdSWP";

// 2
const mutation = graphql`
    mutation insertSWPMutation($object: hira_swp_insert_input!) {
        insert_hira_swp_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntitySWP) => {
	const {
		//0
		client_id,
		project_id,
		site_id,
		//1
		category,
		work_task,
		date_created,
		location,
		department_id,
		person_approving_procedure_id,
		expiry,
		sign_sheet_notes,
		//2
		doc,
		//3
		potential_hazard_and_possible_cause_list, //{id, swp_id, cause, hazard, rating,}
		//4
		ppe_required_list, //{id, swp_id, ppe,}
		//5
		steps_to_perform_task_list,
		//6
		notes,
		//7
		training_requirement_list,
		//8
		sign_sheet_employee_list, //{id, swp_id, signature, employee,}
	} = input;

	// crudUtils.injectCreate(input);

	return await createMutationImpl({mutation, input}).then(res => res && findByIdSWP(res.id));
};
