/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployeeMedical} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeMedicalQuery($id: bigint) {
    hr_employees_docs_medicals_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          annexture_3
          restrictions
          doc
          expiry_date
          expiry_updated
          removed
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
    findOneMutationImpl({ query, variables: {id: input} });
