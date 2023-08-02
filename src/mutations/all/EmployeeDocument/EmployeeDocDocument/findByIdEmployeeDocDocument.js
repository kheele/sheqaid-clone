/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployeeWorkPermit} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeDocDocumentQuery($id: bigint) {
    hr_employees_documents_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          doc
          type
          desc
          expiry_date
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
