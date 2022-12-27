/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityCity} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertCityMutation($object: default_cities_insert_input!) {
    insert_default_cities_one(object: $object) {
      id
    }
  }
`;

// 3
export default (input: EntityCity) =>
  createMutationImpl({ mutation, input });
