/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllActiveEmployeeCounsellingBySupervisorQuery($supervisor_id: bigint) {
    hr_employees_docs_counsellings_connection(where: {removed: {_eq: false}, employee: {supervisor_id: {_eq: $supervisor_id}}}) {
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
// 3
export default (input: number) : [EntityEmployee] =>
    listMutationImpl({ query, variables: {supervisor_id: input} });
