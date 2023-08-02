/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityJobPosition} from "mutations/types.d.ts";
import updateMutationImpl from "../../updateMutationImpl";

// 2
const mutation = graphql`
    mutation insertJobPositionMutation($object: default_job_positions_insert_input!) {
        insert_default_job_positions_one(
            object: $object
        ) {
            id
            created_at
            name
            desc
            doc
            job_position_owner
            employee_list_aggregate{
                aggregate{
                    count
                }
            }
            employee_external_list_aggregate{
                aggregate{
                    count
                }
            }
            ppe_list_aggregate{
                aggregate{
                    count
                }
            }
            toolbox_talk_list_aggregate{
                aggregate{
                    count
                }
            }
            training_plan_list_aggregate{
                aggregate{
                    count
                }
            }
            job_category {
                id
                name
            }
            company{
                id
                name
            }
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
        }
    }
`;

// 3
export default async (input: EntityJobPosition) => {
    const {
        name,
        desc,
        doc,
        job_category_id,
        client_id,
    } = input;

    if (doc) {
        // delete input.doc;
    }

    const {company, user} = storage.loggedUser;
    input.user_id = user.id;
    input.company_id = company.id;

    const newItem = await createMutationImpl({mutation, input});

    if (newItem) {
        // if (doc) {
        //     try {
        //         const path = `job-positions/${newItem.id}`;
        //         const name = "job-position-doc";
        //         const gcsUri = await workers.emit("files/upload", {
        //             file: doc,
        //             path,
        //             name,
        //         });
        //         console.log("gcsUri", gcsUri);
        //
        //         if (gcsUri) {
        //             return updateMutationImpl({
        //                 mutation,
        //                 id: newItem.id,
        //                 attrs: {
        //                     doc: gcsUri
        //                 },
        //             });
        //         }
        //     } catch (err) {
        //         console.log('insertJobPosition error', err)
        //     }
        // }
    }
    return newItem;
};
