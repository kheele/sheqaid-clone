/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySector} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertSectorMutation($object: default_sectors_insert_input!) {
    insert_default_sectors_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntitySector) =>
  createMutationImpl({ mutation, input });
