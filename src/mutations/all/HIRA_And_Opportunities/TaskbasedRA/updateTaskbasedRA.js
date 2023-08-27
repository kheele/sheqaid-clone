/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTaskbasedRA} from "mutations/types.d.ts";
import findByIdTaskbasedRA from "./findByIdTaskbasedRA";

// 2
const mutation = graphql`
    mutation updateTaskbasedRAMutation($id: hira_taskbased_ra_pk_columns_input!, $_set: hira_taskbased_ra_set_input!) {
        update_hira_taskbased_ra_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityTaskbasedRA) => {
	const {
		id,
		client_id,
		project_id,
		site_id,
		activity,
		risk_tolerance,
		expiry_date,
		list,
	} = attrs;

	const item = await findByIdTaskbasedRA(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdTaskbasedRA(res.id));
};