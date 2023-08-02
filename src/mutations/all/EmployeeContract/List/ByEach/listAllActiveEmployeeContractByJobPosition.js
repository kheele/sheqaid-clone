/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "mutations/listMutationImpl";

// 2
const query = graphql`
  query listAllActiveEmployeeContractByJobPositionQuery($job_position_id: bigint) {
    hr_employees_docs_contracts_connection(where: {removed: {_eq: false}, employee: {job_position_id: {_eq: $job_position_id}}}) {
      edges {
        node {
          id
          created_at
          doc
          job_profile_doc
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
          contract_details_list{
            id
            contract_type
            daily_working_hours
            end_of_trial_period
            end_time
            expiry_date
            notes
            start_date
            start_time
          }
          salary_info_list{
            id
            deductible_list{
              id
              created_at
              text
              value
            }
            payment_type
            salary
            salary_interval
            wage
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
export default (input: number) : [EntityEmployee] =>
    listMutationImpl({ query, variables: {job_position_id: input} });
