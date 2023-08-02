/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityEmployee} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateEmployeeMutation($id: hr_employees_pk_columns_input!, $_set: hr_employees_set_input!) {
    update_hr_employees_by_pk(pk_columns: $id, _set: $_set) {
        ...EmployeeFragment
    }
  }
`;

// 3
export default (attrs: EntityEmployee) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
