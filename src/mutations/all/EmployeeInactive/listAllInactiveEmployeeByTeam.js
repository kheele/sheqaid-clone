/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllInactiveEmployeeByTeamQuery($team_id: bigint) {
    hr_employees_connection(where: {removed: {_eq: true}, team_id: {_eq: $team_id}}) {
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
          trainer_training_matrix_list_aggregate{
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
export default (input: number) : [EntityEmployee] =>
    listMutationImpl({ query, variables: {team_id: input} });
