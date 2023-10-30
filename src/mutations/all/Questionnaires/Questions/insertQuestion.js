/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityQuestion} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdQuestion from "./findByIdQuestion";

// 2
const mutation = graphql`
    mutation insertQuestionMutation($object: default_contractor_questionnaires_ques_insert_input!) {
        insert_default_contractor_questionnaires_ques_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityQuestion) => {
	const {
		client_id,
		project_id,
		site_id,
		//
		asset_type,
		asset_id,
		//
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

	// crudUtils.injectCreate(input);

	const res = await createMutationImpl({
		mutation,
		input
	});
	if (res) {
		return findByIdQuestion(res.id);
	}

	return res;
};
