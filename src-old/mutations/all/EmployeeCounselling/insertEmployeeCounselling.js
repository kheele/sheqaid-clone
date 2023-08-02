/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployeeCounselling} from "../../types.d.ts";
import insertEmployeeDocImpl from "../Employee/insertEmployeeDocImpl";
import updateEmployeeCounselling from "./updateEmployeeCounselling";

// 2
const mutation = graphql`
  mutation insertEmployeeCounsellingMutation($object: hr_employees_docs_counsellings_insert_input!) {
    insert_hr_employees_docs_counsellings_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityEmployeeCounselling) => insertEmployeeDocImpl({
  mutation,
  input,
  updateEmployeeDocFn: updateEmployeeCounselling,
  name: 'Counselling',
  plural: 'counsellings',
});
