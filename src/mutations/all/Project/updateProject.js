/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityProject} from "mutations/types.d.ts";

// 2
const mutation = graphql`
    mutation updateProjectMutation($id: default_projects_pk_columns_input!, $_set: default_projects_set_input!) {
        update_default_projects_by_pk(pk_columns: $id, _set: $_set) {
            id
            created_at
            name
            address
            client{
                id
                name
            }
            site_list{
                id
                name
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
export default async (attrs: EntityProject) =>
    updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
