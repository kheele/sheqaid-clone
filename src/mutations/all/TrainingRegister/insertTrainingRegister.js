/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingRegister} from "mutations/types.d.ts";
import {Dates} from "../../../utils/Dates";
import updateMutationImpl from "../../updateMutationImpl";
import crudUtils from "../CRUDUtils/CRUDUtils";
import updateTrainingRegister from "./updateTrainingRegister";

// 2
const mutation = graphql`
    mutation insertTrainingRegisterMutation($object: sheq_training_registers_insert_input!) {
        insert_sheq_training_registers_one(
            object: $object
        ) {
            id
            created_at
            date
            institution_conducting_training
            time_or_duration
            list_proof
            trainer{
                id
                fname
                lname
                email
                phone
            }
            trainer_external{
                id
                fname
                lname
                email
                phone
            }
            training{
                id
                course {
                    id
                    name
                }
            }
            employee_list{
                id
                employee{
                    id
                    fname
                    lname
                    email
                    phone
                }
            }

            client {
                id
                name
            }
            project {
                id
                name
            }
            site {
                id
                name
            }
        }
    }
`;

// 3
export default async (input: EntityTrainingRegister) => {
	const {
		time_or_duration,
		time_from,
		time_to,
		date,
		institution_conducting_training,

		list_proof,
		employee_list,

		trainer_id,
		trainer_external,
		training_id,
		client_id,
		project_id,
		site_id,
	} = input;

	if (list_proof) {
		delete input.list_proof;
	}

	crudUtils.injectCreate(input);

	const newItem = await createMutationImpl({mutation, input});

	if (newItem) {
		if (list_proof) {
			try {
				const path = `trainings/registers/${newItem.id}`;
				const name = "register-doc";
				const gcsUri = await workers.emit("files/upload", {
					file: list_proof,
					path,
					name,
				});
				console.log("gcsUri", gcsUri);

				if (gcsUri) {
					return updateTrainingRegister({
						id: newItem.id,
						list_proof: gcsUri,
					});
				}
			} catch (err) {
				console.log('insertTrainingRegister error', err)
			}
		}
	}
	return newItem;
};
