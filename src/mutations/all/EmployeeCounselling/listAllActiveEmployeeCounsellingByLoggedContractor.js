/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllActiveEmployeeCounsellingByLoggedContractorQuery($contractor_id: bigint) {
    hr_employees_docs_counsellings_connection(where: {removed: {_eq: false}, contractor_id: {_eq: $contractor_id}}) {
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
export default () =>
    listMutationImpl({ query, variables: {contractor_id: 1} });
