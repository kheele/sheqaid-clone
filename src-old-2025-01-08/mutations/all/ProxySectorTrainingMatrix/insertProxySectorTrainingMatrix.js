/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxySectorTrainingMatrix} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxySectorTrainingMatrixMutation($object: proxy_sector__training_matrix_insert_input!) {
    insert_proxy_sector__training_matrix_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxySectorTrainingMatrix) =>
  createMutationImpl({ mutation, input });
