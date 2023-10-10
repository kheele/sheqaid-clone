/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingToolboxTalkSubjectCategory} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
    mutation insertTrainingToolboxTalkSubjectCategoryMutation($object: sheq_training_toolbox_talk_subject_categories_insert_input!) {
        insert_sheq_training_toolbox_talk_subject_categories_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityTrainingToolboxTalkSubjectCategory) => {
	const {
		name,
		client_id,
		project_id,
		site_id,
	} = input;

	crudUtils.injectCreate(input);

	return await createMutationImpl({mutation, input});
};
