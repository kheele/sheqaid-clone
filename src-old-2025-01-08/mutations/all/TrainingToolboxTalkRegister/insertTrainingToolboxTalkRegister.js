/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingToolboxTalkRegister} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
    mutation insertTrainingToolboxTalkRegisterMutation($object: sheq_training_toolbox_talk_registers_insert_input!) {
        insert_sheq_training_toolbox_talk_registers_one(
            object: $object
        ) {
            id
            date
            subject{
                id
                name
            }
            employee_list{
                id
                signature
                date
                employee{
                    id
                    fname
                    lname
                    job_position{
		                    id
		                    name
                    }
                }
            }
            site{
                id
                name
            }
            project{
                id
                name
            }
            client{
                id
                name
            }
            company{
                id
                name
            }
        }
    }
`;

// 3
export default async (input: EntityTrainingToolboxTalkRegister) => {
	const {
		name,
		client_id,
		project_id,
		site_id,
	} = input;

	crudUtils.injectCreate(input);

	const item = await createMutationImpl({mutation, input});
	if(item) {
		const path =  await workers.emit("plugin_sheq_assist/05_Trainings/toolbox-talks/attendance-registers/export-excel", item);
		return {path, item};
	}
};
