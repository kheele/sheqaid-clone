/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentVehicle from "./findByIdIncidentVehicle";

// 2
const mutation = graphql`
    mutation updateIncidentVehicleMutation($id: sheq_incident_investigation_vehicles_pk_columns_input!, $_set: sheq_incident_investigation_vehicles_set_input!) {
        update_sheq_incident_investigation_vehicles_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	const {
		id,
	} = attrs;

	const item = await findByIdIncidentVehicle(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdIncidentVehicle(id));
};
