/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingMatrix} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertTrainingMatrixMutation($object: sheq_training_matrices_insert_input!) {
    insert_sheq_training_matrices_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityTrainingMatrix) =>
  createMutationImpl({ mutation, input });
