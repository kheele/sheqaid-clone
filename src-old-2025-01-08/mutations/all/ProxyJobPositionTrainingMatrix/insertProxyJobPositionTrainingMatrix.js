/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyJobPositionTrainingMatrix} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyJobPositionTrainingMatrixMutation($object: proxy_job_position__training_matrix_insert_input!) {
    insert_proxy_job_position__training_matrix_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyJobPositionTrainingMatrix) =>
  createMutationImpl({ mutation, input });
