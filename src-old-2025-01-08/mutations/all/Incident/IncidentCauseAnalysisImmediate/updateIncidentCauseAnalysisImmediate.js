/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdIncidentCauseAnalysisImmediate from "./findByIdIncidentCauseAnalysisImmediate";
import updateIncidentCauseAnalysisCause from "../IncidentCauseAnalysisCause/updateIncidentCauseAnalysisCause";
import insertIncidentCauseAnalysisCause from "../IncidentCauseAnalysisCause/insertIncidentCauseAnalysisCause";

// 2
const mutation = graphql`
    mutation updateIncidentCauseAnalysisImmediateMutation($id: sheq_incident_investigation_cause_analysis_immediate_pk_columns_input!, $_set: sheq_incident_investigation_cause_analysis_immediate_set_input!) {
        update_sheq_incident_investigation_cause_analysis_immediate_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs) => {
	const {
		id,
		cause_analysis_cause_list,
	} = attrs;

	const item = await findByIdIncidentCauseAnalysisImmediate(id);
	if (!item) return;

	if(cause_analysis_cause_list) {
		delete attrs.cause_analysis_cause_list;

		await Promise.all(cause_analysis_cause_list.map(async v => {
			if(v.id) {
				return updateIncidentCauseAnalysisCause(v);
			} else {
				return insertIncidentCauseAnalysisCause({cause_analysis_immediate_id: id, ...v});
			}
		}));
	}

	if(Object.keys(attrs).length === 1) {
		return findByIdIncidentCauseAnalysisImmediate(id);
	}

	return updateMutationImpl({
		mutation,
		id,
		attrs,
	}).then(res => res && findByIdIncidentCauseAnalysisImmediate(id));
};
