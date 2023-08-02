/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityContractor} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateContractorMutation($id: default_contractors_pk_columns_input!, $_set: default_contractors_set_input!) {
    update_default_contractors_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityContractor) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
