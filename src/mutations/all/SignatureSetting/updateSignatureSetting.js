/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntitySignatureSetting} from "mutations/types.d.ts";
import findByIdSignatureSetting from "./findByIdSignatureSetting";

// 2
const mutation = graphql`
  mutation updateSignatureSettingMutation($id: default_signature_settings_pk_columns_input!, $_set: default_signature_settings_set_input!) {
    update_default_signature_settings_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntitySignatureSetting) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  }).
  then(res => res && findByIdSignatureSetting(res.id));
