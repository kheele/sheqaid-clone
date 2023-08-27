/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTaskbasedRAListItem} from "mutations/types.d.ts";
import findByIdTaskbasedRAListItem from "./findByIdTaskbasedRAListItem";

// 2
const mutation = graphql`
    mutation updateTaskbasedRAListItemMutation($id: hira_taskbased_ra_list_pk_columns_input!, $_set: hira_taskbased_ra_list_set_input!) {
        update_hira_taskbased_ra_list_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityTaskbasedRAListItem) => {
	const {
		id,
		//1
		responsible_person,
		target_date,
		due_date,
		//2
		task_step,
		hazard,
		risk,
		risk_type,
		//3
		consequence_1,
		likelihood_1,
		//4
		control_measure_list,
		consequence_2,
		likelihood_2,
	} = attrs;

	const item = await findByIdTaskbasedRAListItem(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdTaskbasedRAListItem(res.id));
};