/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentInvestigation from "./findByIdIncidentInvestigation";
import updateAssetPhoto from "../../Asset/updateAssetPhoto";
import insertAssetPhoto from "../../Asset/insertAssetPhoto";
import updateAssetDoc from "../../Asset/updateAssetDoc";
import insertAssetDoc from "../../Asset/insertAssetDoc";

// 2
const mutation = graphql`
    mutation updateIncidentInvestigationMutation($id: sheq_incident_investigation_investigations_pk_columns_input!, $_set: sheq_incident_investigation_investigations_set_input!) {
        update_sheq_incident_investigation_investigations_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	const {
		id,
	} = attrs;

	const item = await findByIdIncidentInvestigation(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdIncidentInvestigation(id));
};
