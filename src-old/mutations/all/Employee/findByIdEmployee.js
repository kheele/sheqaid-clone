/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "../../types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeQuery($id: bigint) {
    hr_employees_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          ...EmployeeFragment
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
