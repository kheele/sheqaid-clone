/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTrainingMatrix} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdsTrainingPlanQuery($year: Int, $course_id: bigint, $employee_id: bigint) {
    sheq_training_plans__employee_training_connection(
      where: {year: {_eq: $year}, course_id: {_eq: $course_id}, employee_id: {_eq: $employee_id}}
    ) {
      edges {
        node {
          id
          completion_status
          result_status
          result
          year

          course {
            id
            name
          }
          employee {
            id
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
          }

          training{
            id
            course{
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
export default async ({year, course_id, employee_id}) =>
    year && course_id && employee_id && findOneMutationImpl({ query, variables: {year, course_id, employee_id} });
