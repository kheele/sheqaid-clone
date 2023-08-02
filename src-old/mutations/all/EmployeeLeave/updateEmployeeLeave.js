/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeLeave} from "../../types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeLeave from "./findByIdEmployeeLeave";

// 2
const mutation = graphql`
  mutation updateEmployeeLeaveMutation($id: hr_employees_docs_leaves_pk_columns_input!, $_set: hr_employees_docs_leaves_set_input!) {
    update_hr_employees_docs_leaves_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityEmployeeLeave) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeLeave,
    name: 'Leave',
    plural: 'leaves',
});
