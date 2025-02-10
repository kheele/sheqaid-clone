/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingToolboxTalkSubject} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
    mutation insertTrainingToolboxTalkSubjectMutation($object: sheq_training_toolbox_talk_subjects_insert_input!) {
        insert_sheq_training_toolbox_talk_subjects_one(
            object: $object
        ) {
            id
            name
        }
    }
`;

// 3
export default async (input: EntityTrainingToolboxTalkSubject) => {
	const {
		name,
		client_id,
		project_id,
		site_id,
	} = input;

	crudUtils.injectCreate(input);

	return await createMutationImpl({mutation, input});
};
