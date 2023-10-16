/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentCauseAnalysisCause from "./findByIdIncidentCauseAnalysisCause";

// 2
const mutation = graphql`
    mutation updateIncidentCauseAnalysisCauseMutation($id: sheq_incident_investigation_cause_analysis_causes_pk_columns_input!, $_set: sheq_incident_investigation_cause_analysis_causes_set_input!) {
        update_sheq_incident_investigation_cause_analysis_causes_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	const {
		id,
	} = attrs;

	const item = await findByIdIncidentCauseAnalysisCause(id);
	if (!item) return;

	delete attrs.corrective_action_list_custom_job_factors;
	delete attrs.corrective_action_list_custom_personal_factors;
	delete attrs.corrective_action_list_job_factors;
	delete attrs.corrective_action_list_personal_factors;

	console.log('updateIncidentCauseAnalysisCause attrs', attrs)

	return updateMutationImpl({
		mutation,
		id,
		attrs,
	}).then(res => res && findByIdIncidentCauseAnalysisCause(id));
};
