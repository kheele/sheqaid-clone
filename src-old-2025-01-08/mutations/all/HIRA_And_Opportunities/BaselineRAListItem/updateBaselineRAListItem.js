/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityBaselineRAListItem} from "mutations/types.d.ts";
import findByIdBaselineRAListItem from "./findByIdBaselineRAListItem";
import findByIdTaskbasedRA from "../TaskbasedRA/findByIdTaskbasedRA";

// 2
const mutation = graphql`
    mutation updateBaselineRAListItemMutation($id: hira_baseline_ra_list_pk_columns_input!, $_set: hira_baseline_ra_list_set_input!) {
        update_hira_baseline_ra_list_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityBaselineRAListItem) => {
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
		frequency_1,
		//4
		control_measure_list,
		consequence_2,
		likelihood_2,
		frequency_2,
		//5
		control_measure_list_additional,
		consequence_3,
		likelihood_3,
		frequency_3,
	} = attrs;

	const item = await findByIdBaselineRAListItem(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdBaselineRAListItem(res.id));
};