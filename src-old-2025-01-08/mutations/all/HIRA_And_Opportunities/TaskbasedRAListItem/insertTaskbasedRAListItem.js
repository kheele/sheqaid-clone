/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTaskbasedRAListItem} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdTaskbasedRAListItem from "./findByIdTaskbasedRAListItem";

// 2
const mutation = graphql`
    mutation insertTaskbasedRAListItemMutation($object: hira_taskbased_ra_list_insert_input!) {
        insert_hira_taskbased_ra_list_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityTaskbasedRAListItem) => {
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
		//4
		control_measure_list,
		consequence_2,
		likelihood_2,
	} = input;

	crudUtils.injectCreate(input);

	return await createMutationImpl({mutation, input}).then(res => res && findByIdTaskbasedRAListItem(res.id));
};
