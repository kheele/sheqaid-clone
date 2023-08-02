/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySignatureSetting} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertSignatureSettingMutation($object: default_signature_settings_insert_input!) {
    insert_default_signature_settings_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntitySignatureSetting) =>
  createMutationImpl({ mutation, input });
