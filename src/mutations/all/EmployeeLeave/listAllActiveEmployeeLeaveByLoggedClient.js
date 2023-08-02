/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllActiveEmployeeLeaveByLoggedClientQuery($client_id: bigint) {
    hr_employees_docs_leaves_connection(where: {removed: {_eq: false}, client_id: {_eq: $client_id}}) {
      edges {
        node {
          id
          created_at
          doc
          days_booked
          due_to
          date
          expiry_date
          expiry_updated
          removed
          employee_comments
          type
          notes
          reason
          employee{
            id
            fname
            lname
            phone
            email
            id_num
            passport_num
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
    listMutationImpl({ query, variables: {client_id: input} });
