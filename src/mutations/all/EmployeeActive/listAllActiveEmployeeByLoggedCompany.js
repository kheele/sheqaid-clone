/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllActiveEmployeeByLoggedCompanyQuery($company_id: bigint) {
    hr_employees_connection(where: {removed: {_eq: false}, company_id: {_eq: $company_id}}) {
      edges {
        node {
          id
          created_at,
          fname
          lname
          email
          phone
          dob
          sex
          id_num
          passport_num
          profile_pic
          employment_num
          employment_date
          medical_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          leave_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          ppe_list_aggregate{
            aggregate{
              count
            }
          }
          trainer_training_list_aggregate:trainer_training_matrix_list_aggregate{
            aggregate{
              count
            }
          }
          warning_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          supervisor_employee_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          supervisor{
            id
            fname
            lname
            email
            phone
          }
          linked_user {
            id
            fname
            lname
            username
            phone
          }
          department {
            id
            name
          }
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
    listMutationImpl({ query, variables: {company_id: input} });
