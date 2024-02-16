/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityPPE} from "mutations/types.d.ts";
import updateMutationImpl from "../../updateMutationImpl";
import crudUtils from "../CRUDUtils/CRUDUtils";
import updatePPE from "./updatePPE";

// 2
const mutation = graphql`
    mutation insertPPEMutation($object: ppe_types_insert_input!) {
        insert_ppe_types_one(
            object: $object
        ) {
		        id
            name
            unit
            duration_type
            duration_value
            notes
            profile_pic

            client{
                id
                name
            }
            project{
                id
                name
            }
            site{
                id
                name
            }

            team_list_aggregate{
                aggregate {
                    count
                }
            }
            department_list_aggregate{
                aggregate {
                    count
                }
            }
            job_position_list_aggregate{
                aggregate {
                    count
                }
            }
        }
    }
`;

// 3
export default async (input: EntityPPE) => {
	const {
		name,
		unit,
		duration_type,
		duration_value,
		notes,
		profile_pic,

		client_id,
		project_id,
		site_id,

		team_list,
		department_list,
		job_position_list,
	} = input;

	if (profile_pic) {
		delete input.profile_pic;
	}

	crudUtils.injectCreate(input);

	const newItem = await createMutationImpl({mutation, input});

	if (newItem) {
		if (profile_pic) {
			try {
				const path = `ppes/${newItem.id}`;
				const name = "ppe-doc";
				const gcsUri = await workers.emit("files/upload", {
					file: profile_pic,
					path,
					name,
				});
				console.log("gcsUri", gcsUri);

				if (gcsUri) {
					return updatePPE({
						id: newItem.id,
						profile_pic: gcsUri,
					});
				}
			} catch (err) {
				console.log('insertPPE error', err)
			}
		}
	}
	return newItem;
};
