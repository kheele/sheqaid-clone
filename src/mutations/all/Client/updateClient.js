/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityClient} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateClientMutation($id: default_clients_pk_columns_input!, $_set: default_clients_set_input!) {
    update_default_clients_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityClient) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
