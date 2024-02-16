/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityDepartment} from "mutations/types.d.ts";
import findByIdJobPosition from "../JobPosition/findByIdJobPosition";
import findByIdDepartment from "./findByIdDepartment";

// 2
const mutation = graphql`
    mutation updateDepartmentMutation($id: default_departments_pk_columns_input!, $_set: default_departments_set_input!) {
        update_default_departments_by_pk(pk_columns: $id, _set: $_set) {
            id
            created_at
            name
            ppe_type_list_aggregate{
                aggregate{
                    count
                }
            }
            employee_list_aggregate{
                aggregate{
                    count
                }
            }
            responsible_document_list_aggregate{
                aggregate{
                    count
                }
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
export default async (attrs: EntityDepartment) => {
    const {
        id,
        name,
        client_id,
    } = attrs;

    const existingItem = await findByIdDepartment(id);
    if (!existingItem) {
        return "NOT_FOUND";
    }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};
