/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntitySWP} from "mutations/types.d.ts";
import findByIdSWP from "./findByIdSWP";
import findByIdTaskbasedRA from "../TaskbasedRA/findByIdTaskbasedRA";
import {employee_personal_details_fragment} from "../../../../graphql/Fragments";

// 2
const mutation = graphql`
    mutation updateSWPMutation($id: hira_swp_pk_columns_input!, $_set: hira_swp_set_input!) {
        update_hira_swp_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntitySWP) => {
	const {
		id,
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
	} = attrs;

	const item = await findByIdSWP(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdSWP(res.id));
};