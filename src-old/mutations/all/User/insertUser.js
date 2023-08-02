/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityUser} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertUserMutation($object: default_users_insert_input!) {
    insert_default_users_one(
      object: $object
    ) {
      ...UserFragment
    }
  }
`;

// 3
export default (input: EntityUser) =>
  createMutationImpl({ mutation, input });
