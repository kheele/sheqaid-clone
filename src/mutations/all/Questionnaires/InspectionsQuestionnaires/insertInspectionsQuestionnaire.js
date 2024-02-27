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
	
	
	if(asset_type && !asset_id) {
		const listByLogged = sockets.of("assets").fn('listByLogged');
		
		return listByLogged({
			written_off: false,
			//
			asset_type,
			//
			exact_orgs: true,
			//
			limit: 0,
			offset: 0,
		}).then((res) => {
			console.log('onLoadList res', res)
			if(res && isArray(res)) {
				return Promise.all(res.map(async item => await onCreate({...input, asset_id: item.id})));
			}
		});
	} else {
		return onCreate(input);
	}
};

const onCreate = async (input) => {
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
