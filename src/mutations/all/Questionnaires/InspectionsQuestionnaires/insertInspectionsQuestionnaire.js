/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityInspectionsQuestionnaire} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import findByIdInspectionsQuestionnaire from "./findByIdInspectionsQuestionnaire";

// 2
const mutation = graphql`
    mutation insertInspectionsQuestionnaireMutation($object: default_contractor_questionnaires_insert_input!) {
        insert_default_contractor_questionnaires_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityInspectionsQuestionnaire) => {
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

	crudUtils.injectCreate(input);

	const res = await createMutationImpl({
		mutation,
		input: {is_template: false, group: "Inspections", answered_by: "Sender", ...input}
	});
	if (res) {
		return findByIdInspectionsQuestionnaire(res.id);
	}

	return res;
};
