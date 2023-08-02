/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeDependant} from "mutations/types.d.ts";
import updateMutationImpl from "mutations/updateMutationImpl";
import findByIdEmployeeDependant from "./findByIdEmployeeDependant";

// 2
const mutation = graphql`
  mutation updateEmployeeDependantMutation($id: hr_employees_dependents_pk_columns_input!, $_set: hr_employees_dependents_set_input!) {
    update_hr_employees_dependents_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        fname
        lname
        dob
        gender
        employee_id
        employee{
            id
        }
    }
  }
`;

// 3
export default async (attrs: EntityEmployeeDependant) => {
    const {
        id,
        fname,
        lname,
        gender,
        dob,
        employee_id,
    } = attrs;

    const item = await findByIdEmployeeDependant(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id,
        attrs,
    });
};