/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingCourse} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertTrainingCourseMutation($object: sheq_training_courses_insert_input!) {
    insert_sheq_training_courses_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityTrainingCourse) =>
  createMutationImpl({ mutation, input });
