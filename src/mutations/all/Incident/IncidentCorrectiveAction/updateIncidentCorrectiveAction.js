/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentCorrectiveAction from "./findByIdIncidentCorrectiveAction";

// 2
const mutation = graphql`
    mutation updateIncidentCorrectiveActionMutation($id: sheq_incident_investigation_corrective_actions_factors_pk_columns_input!, $_set: sheq_incident_investigation_corrective_actions_factors_set_input!) {
        update_sheq_incident_investigation_corrective_actions_factors_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	const {
		id,
	} = attrs;

	const item = await findByIdIncidentCorrectiveAction(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdIncidentCorrectiveAction(id));
};
