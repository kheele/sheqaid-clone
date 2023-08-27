/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityBaselineRAListItem} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdBaselineRAListItem from "./findByIdBaselineRAListItem";

// 2
const mutation = graphql`
    mutation insertBaselineRAListItemMutation($object: hira_baseline_ra_list_insert_input!) {
        insert_hira_baseline_ra_list_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityBaselineRAListItem) => {
	const {
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
	} = input;

	crudUtils.injectCreate(input);

	return await createMutationImpl({mutation, input}).then(res => res && findByIdBaselineRAListItem(res.id));
};
