/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityZone} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertZoneMutation($object: default_zones_insert_input!) {
    insert_default_zones_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityZone) =>
  createMutationImpl({ mutation, input });
