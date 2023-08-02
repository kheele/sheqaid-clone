/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityNotificationSetting} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertNotificationSettingMutation($object: notifications_settings_insert_input!) {
    insert_notifications_settings_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityNotificationSetting) =>
  createMutationImpl({ mutation, input });
