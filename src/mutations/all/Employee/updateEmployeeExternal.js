/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import findByIdEmployeeExternal from "./findByIdEmployeeExternal";

// 2
const mutation = graphql`
  mutation updateEmployeeExternalMutation($id: hr_employees_external_pk_columns_input!, $_set: hr_employees_external_set_input!) {
    update_hr_employees_external_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        is_external
        fname
        lname
        full_name
        email
        phone
        id_num
        passport_num
        job_position {
            id
            name
        }
        company {
            id
            name
        }
        client {
            id
            name
        }
        project {
            id
            name
        }
        site {
            id
            name
        }
    }
  }
`;

// 3
export default async (attrs: EntityEmployee) => {
    const {
        id,
        email,
        phone,
    } = attrs;

    const item = await findByIdEmployeeExternal(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};