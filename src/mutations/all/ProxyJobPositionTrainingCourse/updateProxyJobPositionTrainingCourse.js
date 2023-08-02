/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityJobPositionTrainingCourse} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxyJobPositionTrainingCourseMutation($id: proxy_job_position__training_course_pk_columns_input!, $_set: proxy_job_position__training_course_set_input!) {
    update_proxy_job_position__training_course_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityJobPositionTrainingCourse) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
