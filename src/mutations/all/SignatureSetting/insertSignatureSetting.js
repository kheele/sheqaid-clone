/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySignatureSetting} from "mutations/types.d.ts";
import findByIdSignatureSetting from "./findByIdSignatureSetting";
import crudUtils from "../CRUDUtils/CRUDUtils";

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
export default async (input: EntitySignatureSetting) => {
  const {
    is_employee_owning,
    plugin_id,
    module_id,
    signature_settings_list,
  } = input;

  crudUtils.injectCreate(input);

  return createMutationImpl({mutation, input}).then(res => res && findByIdSignatureSetting(res.id));
}
