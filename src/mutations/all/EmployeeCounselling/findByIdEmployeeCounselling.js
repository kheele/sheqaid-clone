/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployeeCounselling} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeCounsellingQuery($id: bigint) {
    hr_employees_docs_counsellings_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          doc
          corrective_actions
          counselling_hrs_to_complete
          expiry_date
          expiry_updated
          removed
          incident_desc
          reasons
          types
          responsible_person{
            id
            fname
            lname
            phone
            email
            id_num
            passport_num
          }
          employee{
            id
            fname
            lname
            phone
            email
            id_num
            passport_num
          }
          witness_list{
            id
            witness{
              fname
              lname
              phone
              email
              id_num
              passport_num
            }
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
