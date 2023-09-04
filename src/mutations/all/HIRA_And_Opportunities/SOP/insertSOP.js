/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySOP} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdSOP from "./findByIdSOP";

// 2
const mutation = graphql`
    mutation insertSOPMutation($object: hira_sop_insert_input!) {
        insert_hira_sop_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntitySOP) => {
	const {
		//0
		client_id,
		project_id,
		site_id,
		//1
		category,
		risk_level,
		location,
		prepared_by_id,
		date_created,
		date_revised,
		//2
		doc,
		//3
		risk_list,
		//4
		close_down_list,
		//5
		safety_pre_requesite_list,
		//6
		custom_safety_pre_requesite_list,
		//7
		procedure_list,
		key_point_list,
		operation_list,
		//8
		other,
	} = input;

	crudUtils.injectCreate(input);

	return await createMutationImpl({mutation, input}).then(res => res && findByIdSOP(res.id));
};
