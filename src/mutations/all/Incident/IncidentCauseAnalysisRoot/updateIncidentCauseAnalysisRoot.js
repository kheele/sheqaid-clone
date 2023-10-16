/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentCauseAnalysisRoot from "./findByIdIncidentCauseAnalysisRoot";
import updateIncidentCauseAnalysisCause from "../IncidentCauseAnalysisCause/updateIncidentCauseAnalysisCause";
import insertIncidentCauseAnalysisCause from "../IncidentCauseAnalysisCause/insertIncidentCauseAnalysisCause";

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
		cause_analysis_cause_list,
	} = attrs;

	const item = await findByIdIncidentCauseAnalysisRoot(id);
	if (!item) return;

	if(cause_analysis_cause_list) {
		delete attrs.cause_analysis_cause_list;

		await Promise.all(cause_analysis_cause_list.map(async v => {
			if(v.id) {
				return updateIncidentCauseAnalysisCause(v);
			} else {
				return insertIncidentCauseAnalysisCause({cause_analysis_root_id: id, ...v});
			}
		}));
	}

	if(Object.keys(attrs).length === 1) {
		return findByIdIncidentCauseAnalysisRoot(id);
	}

	return updateMutationImpl({
		mutation,
		id,
		attrs,
	}).then(res => res && findByIdIncidentCauseAnalysisRoot(id));
};
