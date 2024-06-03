/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeExpense} from "mutations/types.d.ts";
import updateEmployeeDocImpl from "../Employee/updateEmployeeDocImpl";
import findByIdEmployeeExpense from "./findByIdEmployeeExpense";

// 2
const mutation = graphql`
  mutation updateEmployeeExpenseMutation($id: hr_employees_docs_expenses_pk_columns_input!, $_set: hr_employees_docs_expenses_set_input!) {
    update_hr_employees_docs_expenses_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityEmployeeExpense) => updateEmployeeDocImpl({
    mutation,
    attrs,
    findByIdEmployeeFn: findByIdEmployeeExpense,
    name: 'Expense',
    plural: 'expenses',
});
