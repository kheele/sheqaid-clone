/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTrainingMatrix} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllTrainingMatrixByLoggedProjectQuery($project_id: bigint) {
    sheq_training_matrices_connection(
      where: {project_id: {_eq: $project_id}},
      order_by: [
        {course: {name: asc_nulls_last}},
        {course: {unit_standard: asc_nulls_last}},
        {course: {unit_standard_desc: asc_nulls_last}},
        {unit_standard: asc_nulls_last},
        {unit_standard_desc: asc_nulls_last}
      ]
    ) {
      edges {
        node {
          id
          created_at
          competency_evaluation
          cost
          credits
          date_range_start
          date_range_end
          institution_conducting_training
          max_participants_per_course
          nqf_level
          provider_requirement
          requirement
          requirement_legal
          status
          training_frequency
          training_standard
          unit_standard
          unit_standard_desc

          trainer{
            id
            fname
            lname
            email
            phone
          }
          trainer_external{
            id
            fname
            lname
            email
            phone
          }
          trainer_job_position{
            id
            name
          }
          course{
            id
            name
          }

          competency_list{
            id
            created_at
            accreditation_num
            competency_type
            type
            doc
            issued_date
            expiry_date
            expiry_updated
            employee{
              id
              fname
              lname
              phone
              email
              id_num
              passport_num
            }
          }
          job_category_list{
            id
            job_category{
              id
              name
            }
          }
          job_position_list{
            id
            job_position{
              id
              name
            }
          }
          sector_list{
            id
            sector{
              id
              name
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
          training_register_list{
            id
            date
            time_or_duration
            list_proof
            institution_conducting_training
            trainer{
              id
              fname
              lname
              email
              phone
            }
            trainer_external{
              id
              fname
              lname
              email
              phone
            }
            employee_list{
              employee{
                id
                fname
                lname
                email
                phone
              }
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
    listMutationImpl({ query, variables: {project_id: input} });
