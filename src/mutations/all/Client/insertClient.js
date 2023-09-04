/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityClient} from "mutations/types.d.ts";
import updateEmployee from "../Employee/updateEmployee";
import updateMutationImpl from "../../updateMutationImpl";
import updateClient from "./updateClient";
import findByContractorEmailClient from "./findByContractorEmailClient";

// 2
const mutation = graphql`
    mutation insertClientMutation($object: default_clients_insert_input!) {
        insert_default_clients_one(
            object: $object
        ) {
            id
            created_at
            name
            address
            contractor_email
            email
            phone
            profile_pic
            linked_contractor {
                id
                name
                username
            }
            module_list {
                id
                price
                module {
                    id
                    borderColor
                    desc
                    discount
                    faIconLeft
                    faIconRight
                    has_update
                    hover
                    key
                    price
                    sort
                    status
                    svgIconLeft
                    svgIconRight
                    title
                    plugin{
                        key
                    }
                }
            }
            sector_list{
                id
                sector {
                    id
                    name
                }
            }
            project_list{
                id
                name
                site_list {
                    id
                    name
                }
            }
            site_list{
                id
                name
            }
            project_list_aggregate {
                aggregate {
                    count
                }
            }
            site_list_aggregate {
                aggregate {
                    count
                }
            }
            contractor_list_aggregate {
                aggregate {
                    count
                }
            }
            user_list_aggregate {
                aggregate {
                    count
                }
            }
            employee_list_aggregate {
                aggregate {
                    count
                }
            }
            team_list_aggregate {
                aggregate {
                    count
                }
            }
            incident_list_aggregate {
                aggregate {
                    count
                }
            }
            training_matrix_list_aggregate {
                aggregate {
                    count
                }
            }
            asset_list_aggregate {
                aggregate {
                    count
                }
            }
        }
    }
`;

// 3
export default async (input: EntityClient) => {
    const {
        name,
        business_id,
        phone,
        email,
        contractor_email,
        address,
        profile_pic,
        sector_list
    } = input;

    if(contractor_email) {
        const existingItem = await findByContractorEmailClient(contractor_email);
        if (existingItem) {
            return "DUP_CONTRACTOR_EMAIL";
        }
    }

    if (profile_pic) {
        // delete input.profile_pic;//
    }

    const {company, user} = storage.loggedUser;
    input.user_id = user.id;
    input.company_id = company.id;

    const newItem = await createMutationImpl({mutation, input});

    if (newItem) {
        if (profile_pic) {
            try {
                const path = `clients/${newItem.id}`;
                const name = "profile-pic";
                const gcsUri = await workers.emit("files/upload", {
                    file: profile_pic,
                    path,
                    name,
                });
                console.log("gcsUri", gcsUri);

                if (gcsUri) {
                    return updateClient({id: newItem.id, profile_pic: gcsUri});
                }
            } catch (err) {
                console.log('insertClient error', err)
            }
        }
    }
    return newItem;
};
