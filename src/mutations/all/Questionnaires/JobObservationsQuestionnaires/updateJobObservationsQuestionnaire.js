/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityJobObservationsQuestionnaire} from "mutations/types.d.ts";
import findByIdJobObservationsQuestionnaire from "./findByIdJobObservationsQuestionnaire";
import updateProxySectorTrainingCourse from "../../ProxySectorTrainingCourse/updateProxySectorTrainingCourse";
import insertProxySectorTrainingCourse from "../../ProxySectorTrainingCourse/insertProxySectorTrainingCourse";
import updateEmployeeExternal from "../../Employee/updateEmployeeExternal";
import insertEmployeeExternal from "../../Employee/insertEmployeeExternal";

// 2
const mutation = graphql`
    mutation updateJobObservationsQuestionnaireMutation($id: default_contractor_questionnaires_pk_columns_input!, $_set: default_contractor_questionnaires_set_input!) {
        update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityJobObservationsQuestionnaire) => {
	const {
		employee_other,
	} = attrs;

	if (employee_other) {
		delete attrs.employee_other;
		let {data, job_position} = employee_other;
		job_position = job_position || (data && data.job_position);
		if(job_position) {
			delete data.job_position;
			delete employee_other.job_position;
			employee_other.job_position_id = job_position.id;
		}

		let employee_other_pg;
		if (employee_other.id) {
			employee_other_pg = await updateEmployeeExternal(employee_other);
		} else {
			employee_other_pg = await insertEmployeeExternal(employee_other);
		}
		if(employee_other_pg) {
			attrs.employee_other_id = employee_other_pg.id;
		}
	}

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdJobObservationsQuestionnaire(res.id));
};