/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyJobPositionTrainingCourse} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyJobPositionTrainingCourseMutation($object: proxy_job_position__training_course_insert_input!) {
    insert_proxy_job_position__training_course_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyJobPositionTrainingCourse) =>
  createMutationImpl({ mutation, input });
