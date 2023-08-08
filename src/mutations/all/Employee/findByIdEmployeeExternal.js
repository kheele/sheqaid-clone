/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeExternalQuery($id: bigint) {
    hr_employees_external_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          fname
          lname
          full_name
          email
          phone
          id_num
          passport_num
          job_position {
            id
            name
          }
          company {
            id
            name
          }
          client {
            id
            name
          }
          project {
            id
            name
          }
          site {
            id
            name
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
