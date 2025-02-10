/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTrainingCourse} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllTrainingCourseByLoggedProjectQuery($project_id: bigint) {
    sheq_training_courses_connection(
        where: {project_id: {_eq: $project_id}},
        order_by: [{name: asc_nulls_last}, {unit_standard: asc_nulls_last}, {unit_standard_desc: asc_nulls_last}]
    ) {
      edges {
        node {
          id
          created_at

          name
          frequency
          provider
          unit_standard
          unit_standard_desc

          job_position_list {
            id
            job_position{
              id
              name
            }
          }
          sector_list {
            id
            sector{
              id
              name
            }
          }

          training_manual_list {
            id
          }
          training_matrix_list {
              id
              cost
              institution_conducting_training
              trainer {
                  id
              }
          }
          training_plan_list{
                id
                completion_status
                result
                result_status
                year
                employee{
                    id
                    fname
                    lname
                    email
                    phone
                    id_num
                    passport_num
                    employment_num
                    job_position{
                        id
                        name
                    }
                    department{
                        id
                        name
                    }
                }
                course {
                    id
                    name
                }
                training{
                    id
                    course{
                      id
                      name
                    }
                }
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
    listMutationImpl({ query, variables: {project_id: input} });
