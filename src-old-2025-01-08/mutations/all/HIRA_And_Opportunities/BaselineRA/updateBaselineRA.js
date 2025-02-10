/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityBaselineRA} from "mutations/types.d.ts";
import findByIdBaselineRA from "./findByIdBaselineRA";
import findByIdTaskbasedRA from "../TaskbasedRA/findByIdTaskbasedRA";

// 2
const mutation = graphql`
    mutation updateBaselineRAMutation($id: hira_baseline_ra_pk_columns_input!, $_set: hira_baseline_ra_set_input!) {
        update_hira_baseline_ra_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityBaselineRA) => {
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

	const item = await findByIdBaselineRA(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdBaselineRA(res.id));
};