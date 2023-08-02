/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityJobCategoryTrainingMatrix} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxyJobCategoryTrainingMatrixMutation($id: proxy_job_category__training_matrix_pk_columns_input!, $_set: proxy_job_category__training_matrix_set_input!) {
    update_proxy_job_category__training_matrix_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityJobCategoryTrainingMatrix) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
