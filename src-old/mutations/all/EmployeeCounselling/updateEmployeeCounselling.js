/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeCounselling} from "../../types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeCounselling from "./findByIdEmployeeCounselling";

// 2
const mutation = graphql`
  mutation updateEmployeeCounsellingMutation($id: hr_employees_docs_counsellings_pk_columns_input!, $_set: hr_employees_docs_counsellings_set_input!) {
    update_hr_employees_docs_counsellings_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityEmployeeCounselling) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeCounselling,
    name: 'Counselling',
    plural: 'counsellings',
});
