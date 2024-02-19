/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityPPE} from "mutations/types.d.ts";

// 2
const mutation = graphql`
    mutation updatePPEItemMutation($id: ppe_items_pk_columns_input!, $_set: ppe_items_set_input!) {
        update_ppe_items_by_pk(pk_columns: $id, _set: $_set) {
            id
            removed
            created_at
            notes
            profile_pic
            serial_num
            purchase_date
            condition
            ppe_type{
                id
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
