/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityContractorUser} from "mutations/types.d.ts";
import findByIdContractorUser from "./findByIdContractorUser";
import updateNotificationSetting from "../NotificationSetting/updateNotificationSetting";
import insertNotificationSetting from "../NotificationSetting/insertNotificationSetting";
import findByUsernameDuplicateContractorUser from "./findByUsernameDuplicateContractorUser";
import findByPhoneDuplicateContractorUser from "./findByPhoneDuplicateContractorUser";

// 2
const mutation = graphql`
  mutation updateContractorUserMutation($id: default_contractor_users_pk_columns_input!, $_set: default_contractor_users_set_input!) {
    update_default_contractor_users_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityContractorUser) => {
    const {
        id,
        username,
        phone,
        notifications_settings,
        // permissions_modules,
        // permissions_other,
    } = attrs;

    const item = await findByIdContractorUser(id);
    if (!item) return;

    if (username) {
        const existingUser = await findByUsernameDuplicateContractorUser({id, username});
        if (existingUser) {
            return "EMAIL_DUP";
        }
    }
    if (phone) {
        const existingUser = await findByPhoneDuplicateContractorUser({id, phone});
        if (existingUser) {
            return "PHONE_DUP";
        }
    }

    if (notifications_settings) {
        delete attrs.notifications_settings;

        let item = notifications_settings.data || notifications_settings;
        if (item.id) {
            item = await updateNotificationSetting(item);
        } else {
            item = await insertNotificationSetting(item);
        }

        attrs.notifications_settings_id = item.id;
    }
    // if(notifications_settings) {
    //     delete attrs.notifications_settings;
    // }
    // if(notifications_settings) {
    //     delete attrs.notifications_settings;
    // }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};
