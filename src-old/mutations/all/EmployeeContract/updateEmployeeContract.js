/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeContract} from "../../types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeContract from "./findByIdEmployeeContract";

// 2
const mutation = graphql`
  mutation updateEmployeeContractMutation($id: hr_employees_docs_contracts_pk_columns_input!, $_set: hr_employees_docs_contracts_set_input!) {
    update_hr_employees_docs_contracts_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityEmployeeContract) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeContract,
    name: 'Contract',
    plural: 'contracts',
});
