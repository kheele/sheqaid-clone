/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityContractorUser} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateContractorUserMutation($id: default_contractor_users_pk_columns_input!, $_set: default_contractor_users_set_input!) {
    update_default_contractor_users_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityContractorUser) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
