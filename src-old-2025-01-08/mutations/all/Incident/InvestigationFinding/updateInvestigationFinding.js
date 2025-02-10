/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdInvestigationFinding from "./findByIdInvestigationFinding";

// 2
const mutation = graphql`
    mutation updateInvestigationFindingMutation($id: sheq_incident_investigation_investigations_findings_pk_columns_input!, $_set: sheq_incident_investigation_investigations_findings_set_input!) {
        update_sheq_incident_investigation_investigations_findings_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	const {
		id,
	} = attrs;

	const item = await findByIdInvestigationFinding(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdInvestigationFinding(id));
};
