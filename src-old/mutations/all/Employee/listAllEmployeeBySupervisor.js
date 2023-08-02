/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployee} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllEmployeeBySupervisorQuery($supervisor_id: bigint) {
    hr_employees_connection(where: {supervisor_id: {_eq: $supervisor_id}}) {
      edges {
        node {
          ...EmployeeFragment
        }
      }
    }
  }
`;
// 3
export default (input: number) : [EntityEmployee] =>
    listMutationImpl({ query, variables: {supervisor_id: input} });
