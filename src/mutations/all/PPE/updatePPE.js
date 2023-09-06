/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityPPE} from "mutations/types.d.ts";

// 2
const mutation = graphql`
    mutation updatePPEMutation($id: ppe_pk_columns_input!, $_set: ppe_set_input!) {
        update_ppe_by_pk(pk_columns: $id, _set: $_set) {
            id
            name
            unit
            qty_received
            qty_issued
            qty_in_stock
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
export default async (attrs: EntityPPE) =>
    updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
