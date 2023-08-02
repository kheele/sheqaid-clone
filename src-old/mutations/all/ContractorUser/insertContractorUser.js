/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityContractorUser} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertContractorUserMutation($object: default_contractor_users_insert_input!) {
    insert_default_contractor_users_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityContractorUser) =>
  createMutationImpl({ mutation, input });
