/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityJobCategory} from "mutations/types.d.ts";
import findByIdJobPosition from "../JobPosition/findByIdJobPosition";
import findByIdJobCategory from "./findByIdJobCategory";

// 2
const mutation = graphql`
  mutation updateJobCategoryMutation($id: default_job_categories_pk_columns_input!, $_set: default_job_categories_set_input!) {
    update_default_job_categories_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        name
        job_category_owner
        job_position_list_aggregate{
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
export default async (attrs: EntityJobCategory) => {
    const {
        id,
        name,
        client_id,
    } = attrs;

    const existingItem = await findByIdJobCategory(id);
    if (!existingItem) {
        return "NOT_FOUND";
    }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};