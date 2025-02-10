/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntitySOP} from "mutations/types.d.ts";
import findByIdSOP from "./findByIdSOP";
import findByIdTaskbasedRA from "../TaskbasedRA/findByIdTaskbasedRA";
import {employee_personal_details_fragment} from "../../../../graphql/Fragments";

// 2
const mutation = graphql`
    mutation updateSOPMutation($id: hira_sop_pk_columns_input!, $_set: hira_sop_set_input!) {
        update_hira_sop_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntitySOP) => {
	const {
		id,
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
	} = attrs;

	const item = await findByIdSOP(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdSOP(res.id));
};