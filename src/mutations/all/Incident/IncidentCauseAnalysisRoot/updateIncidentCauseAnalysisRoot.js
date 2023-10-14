/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentCauseAnalysisRoot from "./findByIdIncidentCauseAnalysisRoot";

// 2
const mutation = graphql`
    mutation updateIncidentCauseAnalysisRootMutation($id: sheq_incident_investigation_cause_analysis_root_pk_columns_input!, $_set: sheq_incident_investigation_cause_analysis_root_set_input!) {
        update_sheq_incident_investigation_cause_analysis_root_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	const {
		id,
	} = attrs;

	const item = await findByIdIncidentCauseAnalysisRoot(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdIncidentCauseAnalysisRoot(id));
};
