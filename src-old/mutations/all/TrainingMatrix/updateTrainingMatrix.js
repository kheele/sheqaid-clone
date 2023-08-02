/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingMatrix} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateTrainingMatrixMutation($id: sheq_training_matrices_pk_columns_input!, $_set: sheq_training_matrices_set_input!) {
    update_sheq_training_matrices_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityTrainingMatrix) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
