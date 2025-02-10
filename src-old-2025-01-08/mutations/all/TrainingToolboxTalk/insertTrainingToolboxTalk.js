/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingToolboxTalk} from "mutations/types.d.ts";
import {Dates} from "../../../utils/Dates";
import updateMutationImpl from "../../updateMutationImpl";
import crudUtils from "../CRUDUtils/CRUDUtils";
import updateTrainingToolboxTalk from "./updateTrainingToolboxTalk";
import findByIdTrainingToolboxTalk from "./findByIdTrainingToolboxTalk";

// 2
const mutation = graphql`
    mutation insertTrainingToolboxTalkMutation($object: sheq_training_toolbox_talks_insert_input!) {
        insert_sheq_training_toolbox_talks_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityTrainingToolboxTalk) => {
	const {
		client_id,
		project_id,
		site_id,
		//
		subject_id,
		subject_category,
		training_frequency,
		//
		toolbox_talk_list,//{date, time_from, time_to, institution_conducting_training, trainer_id, trainer_other, trainer_job_position_id, doc, attendance_register_doc, attendance_register_list}
	} = input;

	if (toolbox_talk_list) {
		// delete input.toolbox_talk_list;
		
		toolbox_talk_list.data.forEach(input => {
			crudUtils.injectCreate(input);
		});
		
		// const toolbox_talk_list_data_without_files = toolbox_talk_list.data.filter(input => {
		// 	const {doc, attendance_register_doc} = input;
		// 	return !doc && !attendance_register_doc;
		// });
		//
		// const toolbox_talk_list_data_with_files = toolbox_talk_list.data.filter(input => {
		// 	const {doc, attendance_register_doc} = input;
		// 	return !!doc || !!attendance_register_doc;
		// });
		
	}

	crudUtils.injectCreate(input);
	
	const newItem = await createMutationImpl({mutation, input});

	if (newItem) {
		// if (list_proof) {
		// 	try {
		// 		const path = `trainings/registers/${newItem.id}`;
		// 		const name = "register-doc";
		// 		const gcsUri = await workers.emit("files/upload", {
		// 			file: list_proof,
		// 			path,
		// 			name,
		// 		});
		// 		console.log("gcsUri", gcsUri);
		//
		// 		if (gcsUri) {
		// 			return updateTrainingToolboxTalk({
		// 				id: newItem.id,
		// 				list_proof: gcsUri,
		// 			});
		// 		}
		// 	} catch (err) {
		// 		console.log('insertTrainingToolboxTalk error', err)
		// 	}
		// }
		return findByIdTrainingToolboxTalk(newItem.id);
	}
	return newItem;
};
