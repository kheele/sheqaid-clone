/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeWarning} from "../../types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeWarning from "./findByIdEmployeeWarning";

// 2
const mutation = graphql`
  mutation updateEmployeeWarningMutation($id: hr_employees_docs_warnings_pk_columns_input!, $_set: hr_employees_docs_warnings_set_input!) {
    update_hr_employees_docs_warnings_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityEmployeeWarning) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeWarning,
    name: 'Warning',
    plural: 'warnings',
});
