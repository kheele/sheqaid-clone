/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityCity} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateCityMutation($id: default_cities_pk_columns_input!, $_set: default_cities_set_input!) {
    update_default_cities_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityCity) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
