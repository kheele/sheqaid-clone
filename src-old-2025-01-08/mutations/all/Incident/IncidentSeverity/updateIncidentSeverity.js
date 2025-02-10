/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentSeverity from "./findByIdIncidentSeverity";

// 2
const mutation = graphql`
    mutation updateIncidentSeverityMutation($id: sheq_incident_investigation_severity_pk_columns_input!, $_set: sheq_incident_investigation_severity_set_input!) {
        update_sheq_incident_investigation_severity_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	const {
		id,
	} = attrs;

	const item = await findByIdIncidentSeverity(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdIncidentSeverity(id));
};
