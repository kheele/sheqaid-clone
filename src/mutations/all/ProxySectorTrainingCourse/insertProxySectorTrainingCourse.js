/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxySectorTrainingCourse} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxySectorTrainingCourseMutation($object: proxy_sector__training_course_insert_input!) {
    insert_proxy_sector__training_course_one(
      object: $object
    ) {
      id
      course{
        id
        name
      }
      sector{
        id
        name
      }
    }
  }
`;

// 3
export default (input: EntityProxySectorTrainingCourse) =>
  createMutationImpl({ mutation, input });
