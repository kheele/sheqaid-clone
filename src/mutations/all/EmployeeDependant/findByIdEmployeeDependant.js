/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";

// 2
const query = graphql`
  query findByIdEmployeeDependantQuery($id: bigint) {
    hr_employees_dependents_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          fname
          lname
          dob
          gender
          employee_id
          employee{
            id
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
