/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityDocument} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertDocumentMutation($object: sheq_documents_insert_input!) {
    insert_sheq_documents_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityDocument) =>
  createMutationImpl({ mutation, input });
