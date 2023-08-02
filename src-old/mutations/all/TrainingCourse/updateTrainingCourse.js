/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingCourse} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateTrainingCourseMutation($id: sheq_training_courses_pk_columns_input!, $_set: sheq_training_courses_set_input!) {
    update_sheq_training_courses_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityTrainingCourse) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
