/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityCountry} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation updateCountryMutation($id: default_countries_pk_columns_input!, $_set: default_countries_set_input!) {
    update_default_countries_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default (attrs: EntityCountry) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
