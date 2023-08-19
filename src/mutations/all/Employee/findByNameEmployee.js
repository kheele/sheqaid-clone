/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByNameEmployeeQuery($fname: String, $lname: String) {
    hr_employees_connection(where: {fname: {_eq: $fname}, lname: {_eq: $lname}}) {
      edges {
        node {
          id
#          ...EmployeeFragment
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input) =>
    input && findOneMutationImpl({ query, variables: input });
