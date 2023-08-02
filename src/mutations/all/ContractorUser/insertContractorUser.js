/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityContractorUser} from "mutations/types.d.ts";
import moduleManager from "../../../app/ModuleManager";
import storage from "../../../storage/Storage";
import checkByUsernameUser from "../User/checkByUsernameUser";
import findByPhoneUser from "../User/findByPhoneUser";
import {Dates} from "../../../utils/Dates";
import checkByUsernameContractorUser from "./checkByUsernameContractorUser";
import findByPhoneContractorUser from "./findByPhoneContractorUser";
import updateEmployee from "../Employee/updateEmployee";

// 2
const mutation = graphql`
  mutation insertContractorUserMutation($object: default_contractor_users_insert_input!) {
    insert_default_contractor_users_one(
      object: $object
    ) {
      id
      auth_id
      created_at,
      fname
      lname
      full_name
      username
      phone
      profile_pic
      auth_type
      has_biometric
      permissions_module_list {
        actions {
          create
          edit
          id
          remove
          share
          view
        }
        id
        module {
          key
          id
          plugin {
            id
            key
            desc
            title
            status
          }
          title
        }
      }
      permissions_other_list {
        actions {
          create
          edit
          id
          remove
          share
          view
        }
        id
        key {
          value
          id
        }
      }
      notifications_settings {
        id
        receive_asset_management_notifs
        receive_chemicals_management_notifs
        receive_contractor_management_notifs
        receive_employees_expired_docs_medicals
        receive_employees_profile_notifs
        receive_incident_management_notifs
        receive_non_conformance_management_notifs
        receive_training_management_notifs
        receive_expired_docs_notifs
      }
      linked_employee {
        id
        fname
        lname
        email
        phone
      }
      company {
        id
        name
      }
      contractor {
        id
        name
      }
      site {
        id
        name
      }
    }
  }
`;

// 3
export default async (input) => {
  const {
    fname,
    lname,
    username,
    phone,
    profile_pic,
    linked_employee_id,
    notifications_settings: {
      data: {
        receive_asset_management_notifs,
        receive_chemicals_management_notifs,
        receive_contractor_management_notifs,
        receive_employees_expired_docs_medicals,
        receive_employees_profile_notifs,
        receive_incident_management_notifs,
        receive_non_conformance_management_notifs,
        receive_training_management_notifs,
        receive_expired_docs_notifs,
      }
    }
  } = input;

  {
    const permissions_module_list = moduleManager.moduleListInstalledAll.map(({id}) => {
      return {module_id: id, actions: {data: {create: true, view: true, edit: true, remove: true, share: true}}};
    });
    const permissions_other_list = storage.list.permissionOtherKeys.map(key => {
      return {key_id: key.id, actions: {data: {create: true, edit: true, view: true, remove: true, share: true}}};
    });//{id, key: {id, value}, actions}

    input.permissions_module_list = {
      data: permissions_module_list,
    };
    input.permissions_other_list = {
      data: permissions_other_list
    };
  }

  let existingUser = await checkByUsernameContractorUser(username);
  if (existingUser) {
    return "EMAIL_DUP";
  }

  // existingUser = await findByPhoneContractorUser(phone);
  // if (existingUser) {
  //   return "PHONE_DUP";
  // }

  if (profile_pic) {
    delete input.profile_pic;
  }

  const {company, user} = storage.loggedUser;
  input.user_id = user.id;
  // input.company_id = company.id;

  const newUser = await createMutationImpl({mutation, input});

  if (newUser) {
    if(linked_employee_id) {
      await updateEmployee({
        id: linked_employee_id,
        linked_user_id: newUser.id,
      });
    }
    return await workers.emit("plugin_sheq_assist/contractors/users/create", {newUser, profile_pic});
  }
};
