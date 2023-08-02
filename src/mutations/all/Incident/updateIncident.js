/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityIncident} from "mutations/types.d.ts";
import findByIdIncident from "./findByIdIncident";

// 2
const mutation = graphql`
    mutation updateIncidentMutation($id: sheq_incident_investigation_pk_columns_input!, $_set: sheq_incident_investigation_set_input!) {
        update_sheq_incident_investigation_by_pk(pk_columns: $id, _set: $_set) {
            id
            #        created_at

        }
    }
`;

// 3
export default async (attrs: EntityIncident) => {
	const {
		id,
	} = attrs;

	const item = await findByIdIncident(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdIncident(res.id));
};
