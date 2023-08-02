/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityJobPosition} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateJobPositionMutation($id: default_job_positions_pk_columns_input!, $_set: default_job_positions_set_input!) {
    update_default_job_positions_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityJobPosition) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
