/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityClient} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertClientMutation($object: default_clients_insert_input!) {
    insert_default_clients_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityClient) =>
  createMutationImpl({ mutation, input });
