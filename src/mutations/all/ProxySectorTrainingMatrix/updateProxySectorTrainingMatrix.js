/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityProxySectorTrainingMatrix} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateProxySectorTrainingMatrixMutation($id: proxy_sector__training_matrix_pk_columns_input!, $_set: proxy_sector__training_matrix_set_input!) {
    update_proxy_sector__training_matrix_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityProxySectorTrainingMatrix) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
