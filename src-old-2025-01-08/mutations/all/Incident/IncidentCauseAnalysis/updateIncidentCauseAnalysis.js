/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentCauseAnalysis from "./findByIdIncidentCauseAnalysis";

// 2
const mutation = graphql`
    mutation updateIncidentCauseAnalysisMutation($id: sheq_incident_investigation_cause_analysis_pk_columns_input!, $_set: sheq_incident_investigation_cause_analysis_set_input!) {
        update_sheq_incident_investigation_cause_analysis_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	const {
		id,
	} = attrs;

	const item = await findByIdIncidentCauseAnalysis(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdIncidentCauseAnalysis(id));
};
