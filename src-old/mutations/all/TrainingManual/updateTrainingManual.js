/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingManual} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateTrainingManualMutation($id: sheq_training_manuals_pk_columns_input!, $_set: sheq_training_manuals_set_input!) {
    update_sheq_training_manuals_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityTrainingManual) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
