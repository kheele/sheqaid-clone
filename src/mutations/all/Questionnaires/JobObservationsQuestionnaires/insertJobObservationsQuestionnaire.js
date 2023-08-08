/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityJobObservationsQuestionnaire} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdJobObservationsQuestionnaire from "./findByIdJobObservationsQuestionnaire";

// 2
const mutation = graphql`
    mutation insertJobObservationsQuestionnaireMutation($object: default_contractor_questionnaires_insert_input!) {
        insert_default_contractor_questionnaires_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityJobObservationsQuestionnaire) => {
	const {
		client_id,
		project_id,
		site_id,
		//
		asset_type,
		asset_id,
		//
		employee_other,
		responsible_person_id,
		responsible_department_id,
		interval,
		start_date,
		//
		template_id,
		//
		name,
		desc,
		question_list,
	} = input;

	//https://31ff-197-189-181-96.eu.ngrok.io/api/callables/triggered-events/questionnaires/uploadQuestionnaireFilesNew

	crudUtils.injectCreate(input);

	if(employee_other && employee_other.data) {
		crudUtils.injectCreate(employee_other.data);
	}

	const res = await createMutationImpl({
		mutation,
		input: {is_template: false, group: "Job Observations", answered_by: "Sender", ...input}
	});
	if (res) {
		return findByIdJobObservationsQuestionnaire(res.id);
	}

	return res;
};
