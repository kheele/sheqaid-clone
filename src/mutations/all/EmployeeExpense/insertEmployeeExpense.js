/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeExpense} from "mutations/types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeExpense from "./updateEmployeeExpense";
import findByIdEmployeeExpense from "./findByIdEmployeeExpense";

// 2
const mutation = graphql`
  mutation insertEmployeeExpenseMutation($object: hr_employees_docs_expenses_insert_input!) {
    insert_hr_employees_docs_expenses_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityEmployeeExpense) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeExpense,
  findByIdEmployeeDocFn: findByIdEmployeeExpense,
  name: 'Expense',
  plural: 'expenses',
});
