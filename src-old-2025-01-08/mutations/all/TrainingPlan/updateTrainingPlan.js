/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingPlan} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateTrainingPlanMutation($id: sheq_training_plans__job_position_course_pk_columns_input!, $_set: sheq_training_plans__job_position_course_set_input!) {
    update_sheq_training_plans__job_position_course_by_pk(pk_columns: $id, _set: $_set) {
        id
        created_at
        year
        course {
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
`;

// 3
export default async (attrs: EntityTrainingPlan) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
