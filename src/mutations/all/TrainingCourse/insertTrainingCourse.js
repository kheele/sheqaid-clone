/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingCourse} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
  mutation insertTrainingCourseMutation($object: sheq_training_courses_insert_input!) {
    insert_sheq_training_courses_one(
      object: $object
    ) {
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
`;

// 3
export default async (input: EntityTrainingCourse) => {
  const {
    name,
    frequency,
    provider,
    unit_standard,
    unit_standard_desc,
    sector_list,
    job_position_list,
    client_id,
    project_id,
    site_id,
  } = input;

  crudUtils.injectCreate(input);

  return await createMutationImpl({mutation, input});
};
