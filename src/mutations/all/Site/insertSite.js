/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySite} from "mutations/types.d.ts";

// 2
const mutation = graphql`
    mutation insertSiteMutation($object: default_sites_insert_input!) {
        insert_default_sites_one(
            object: $object
        ) {
            id
            created_at
            name
            address
            project{
                id
                name
            }
            client{
                id
                name
            }
            contractor_site_user_list_aggregate {
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
export default async (input: EntitySite) => {
    const {
        name,
        address,
        project_id,
        client_id
    } = input;

    // const {company, user} = storage.loggedUser;
    // input.user_id = user.id;
    // input.company_id = company.id;

    return await createMutationImpl({mutation, input});
};
