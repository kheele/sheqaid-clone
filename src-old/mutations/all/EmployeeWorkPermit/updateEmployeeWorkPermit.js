/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeWorkPermit} from "../../types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeWorkPermit from "./findByIdEmployeeWorkPermit";

// 2
const mutation = graphql`
  mutation updateEmployeeWorkPermitMutation($id: hr_employees_docs_work_permits_pk_columns_input!, $_set: hr_employees_docs_work_permits_set_input!) {
    update_hr_employees_docs_work_permits_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityEmployeeWorkPermit) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeWorkPermit,
    name: 'Work-Permit',
    plural: 'work-permits',
});
