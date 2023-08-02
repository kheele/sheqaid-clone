/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityZone} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateZoneMutation($id: default_zones_pk_columns_input!, $_set: default_zones_set_input!) {
    update_default_zones_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityZone) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
