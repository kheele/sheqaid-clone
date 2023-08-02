/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityCountry} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertCountryMutation($object: default_countries_insert_input!) {
    insert_default_countries_one(
      object: $object
#      on_conflict: { constraint: default_countries_pkey, update_columns: [iso2, iso3] }
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityCountry) =>
  createMutationImpl({ mutation, input });
