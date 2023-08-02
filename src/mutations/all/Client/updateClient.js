/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityClient} from "mutations/types.d.ts";
import findByIdClient from "./findByIdClient";
import findByContractorEmailClient from "./findByContractorEmailClient";
import checkByContractorEmailClient from "./checkByContractorEmailClient";

// 2
const mutation = graphql`
    mutation updateClientMutation($id: default_clients_pk_columns_input!, $_set: default_clients_set_input!) {
        update_default_clients_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityClient) => {
    const {
        id,
        name,
        business_id,
        phone,
        email,
        contractor_email,
        address,
        profile_pic,
        sector_list
    } = attrs;

    if(contractor_email) {
        const existingItem = await checkByContractorEmailClient({id, contractor_email});
        if (existingItem) {
            return "DUP_CONTRACTOR_EMAIL";
        }
    }

    const item = await findByIdClient(id);
    if(!item) return;

    if (profile_pic && !profile_pic.dlUrls) {
        const path = `clients/${id}`;
        const name = "profile-pic";
        const gcsUri = await workers.emit("files/upload", {
            file: profile_pic,
            path,
            name,
        });
        console.log("gcsUri", gcsUri);

        attrs.profile_pic = gcsUri;
    }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};
