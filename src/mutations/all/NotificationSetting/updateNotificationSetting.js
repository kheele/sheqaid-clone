/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityNotificationSetting} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateNotificationSettingMutation($id: notifications_settings_pk_columns_input!, $_set: notifications_settings_set_input!) {
    update_notifications_settings_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityNotificationSetting) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
