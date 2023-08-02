/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeContract} from "../../types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeContract from "./updateEmployeeContract";

// 2
const mutation = graphql`
  mutation insertEmployeeContractMutation($object: hr_employees_docs_contracts_insert_input!) {
    insert_hr_employees_docs_contracts_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityEmployeeContract) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeContract,
  name: 'Contract',
  plural: 'contracts',
});
