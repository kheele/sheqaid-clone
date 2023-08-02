/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import checkByUsernameUser from "./checkByUsernameUser";
import updateEmployee from "../Employee/updateEmployee";

// 2
const mutation = graphql`
    mutation insertUserMutation($object: default_users_insert_input!) {
        insert_default_users_one(
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
            client {
                id
                name
            }
            project {
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
export default async (input: EntityUser) => {
    const {
        profile_pic,
        fname,
        lname,
        username,
        auth_type,
        linked_employee_id,
        site_id,
        project_id,
        client_id,
        blacklisted_client_list,
        blacklisted_project_list,
        blacklisted_site_list,
        notifications_settings,
        permissions_module_list,
        permissions_other_list,
    } = input;

    const existingUser = await checkByUsernameUser(username);
    if (existingUser) {
        return "EMAIL_DUP";
    }

    if (profile_pic) {
        delete input.profile_pic;
    }

    const {company, user} = storage.loggedUser;
    input.user_id = user.id;
    input.company_id = company.id;

    const newUser = await createMutationImpl({mutation, input});

    if (newUser) {
        if(linked_employee_id) {
            await updateEmployee({
                id: linked_employee_id,
                linked_user_id: newUser.id,
            });
        }
        return await workers.emit("users/accounts/create", {newUser, profile_pic});
    }
};
