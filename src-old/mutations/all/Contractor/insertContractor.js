/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityContractor} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertContractorMutation($object: default_contractors_insert_input!) {
    insert_default_contractors_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityContractor) =>
  createMutationImpl({ mutation, input });
