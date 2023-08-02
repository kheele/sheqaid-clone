/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntitySite} from "mutations/types.d.ts";

// 2
const mutation = graphql`
    mutation updateSiteMutation($id: default_sites_pk_columns_input!, $_set: default_sites_set_input!) {
        update_default_sites_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntitySite) =>
    updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
