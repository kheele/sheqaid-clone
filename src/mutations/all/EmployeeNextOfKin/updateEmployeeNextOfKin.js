/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeNextOfKin} from "mutations/types.d.ts";
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdEmployeeNextOfKin from "./findByIdEmployeeNextOfKin";

// 2
const mutation = graphql`
  mutation updateEmployeeNextOfKinMutation($id: hr_employees_next_of_kin_pk_columns_input!, $_set: hr_employees_next_of_kin_set_input!) {
    update_hr_employees_next_of_kin_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        fname
        lname
        phone1
        phone2
        relationship
        employee_id
        employee{
            id
        }
    }
  }
`;

// 3
export default async (attrs: EntityEmployeeNextOfKin) => {
    const {
        id,
        fname,
        lname,
        phone1,
        phone2,
        relationship,
        employee_id,
    } = attrs;

    const item = await findByIdEmployeeNextOfKin(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id,
        attrs,
    });
};
