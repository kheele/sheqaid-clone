/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityPPE} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updatePPEMutation($id: ppe_pk_columns_input!, $_set: ppe_set_input!) {
    update_ppe_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityPPE) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
