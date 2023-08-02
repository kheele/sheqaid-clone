/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "mutations/listMutationImpl";

// 2
const query = graphql`
  query listAllByGroupEmployeeContractByLoggedClientQuery($removed: Boolean, $client_id: bigint) {
    hr_employees_connection(where: {
      client_id: {_eq: $client_id}, 
      contract_list_aggregate: {count: {predicate: {_gt: 0}}}, 
      contract_list: {removed: {_eq: $removed}}
    }) {
      edges {
        node {
          id
          created_at
          fname
          lname
          phone
          email
          id_num
          passport_num
          contract_list(where: {removed: {_eq: $removed}}, order_by: {contract_details_aggregate: {max: {expiry_date: desc_nulls_last}}}){
            id
            created_at
            doc
            job_profile_doc
            expiry_updated
            removed
            employee{
              id
            }
            contract_details{
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
            salary_info{
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
export default async ({input, removed = false}) =>
    listMutationImpl({query, variables: {client_id: input, removed}});
