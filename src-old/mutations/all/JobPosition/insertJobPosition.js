/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityJobPosition} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertJobPositionMutation($object: default_job_positions_insert_input!) {
    insert_default_job_positions_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityJobPosition) =>
  createMutationImpl({ mutation, input });
