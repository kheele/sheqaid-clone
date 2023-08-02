/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityPPE} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertPPEMutation($object: ppe_insert_input!) {
    insert_ppe_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityPPE) =>
  createMutationImpl({ mutation, input });
