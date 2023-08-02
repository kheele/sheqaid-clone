/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyJobCategoryTrainingMatrix} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyJobCategoryTrainingMatrixMutation($object: proxy_job_category__training_matrix_insert_input!) {
    insert_proxy_job_category__training_matrix_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyJobCategoryTrainingMatrix) =>
  createMutationImpl({ mutation, input });
