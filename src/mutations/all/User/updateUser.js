/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import findByIdUser from "./findByIdUser";
import findByUsernameDuplicateUser from "./findByUsernameDuplicateUser";
import findByPhoneDuplicateUser from "./findByPhoneDuplicateUser";

// 2
const mutation = graphql`
    mutation updateUserMutation($id: default_users_pk_columns_input!, $_set: default_users_set_input!) {
        update_default_users_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityUser) => {
    const {
        id,
        username,
        phone,
        // notifications_settings,
        // permissions_modules,
        // permissions_other,
        //
        password_conf,
        passwordVerified,
        //
        checkLogin = true,
    } = attrs;

    delete attrs.checkLogin;

    const item = await findByIdUser(id);
    if (!item) return;

    if (password_conf) {
        delete attrs.password_conf;
    }
    if ('passwordVerified' in attrs) {
        delete attrs.passwordVerified;
    }

    if (username) {
        const existingUser = await findByUsernameDuplicateUser({id, username});
        if (existingUser) {
            return "EMAIL_DUP";
        }
    }
    if (phone) {
        const existingUser = await findByPhoneDuplicateUser({id, phone});
        if (existingUser) {
            return "PHONE_DUP";
        }
    }

    if (username || phone) {
        const {loggedUser, loggedUserAuth, login: {currAuth}} = storage;
        const {email: old_username, phoneNumber: old_phone} = loggedUserAuth;
        const {username: new_username, phone: new_phone} = attrs;
        console.log('users update new_username new_phone', new_username, new_phone)
        if (loggedUser.user.id === id) {
            if (!password_conf) {
                return "PASSWORD_CONF_REQUIRED";
            }

            const updateUsernameImpl = async (fnName, new_value, credental) => {
                try {
                    await loggedUserAuth.reauthenticateWithCredential(credental);
                    try {
                        await loggedUserAuth[fnName](new_value);
                        return new_value;
                    } catch (err) {
                        throw err;
                    }
                } catch (err) {
                    throw err;
                }
            };

            if (username) {
                try {
                    const new_username_res = await updateUsernameImpl(
                        'updateEmail',
                        new_username,
                        firebase.auth.EmailAuthProvider.credential(old_username, password_conf)
                    );
                    loggedUser.user.data.username = new_username_res;
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            }
            if (phone) {
                try {
                    const new_phone_res = await updateUsernameImpl(
                        'updatePhoneNumber',
                        new_phone,
                        firebase.auth.EmailAuthProvider.credential(old_username, password_conf)
                    );
                    loggedUser.user.data.phone = new_phone_res;
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            }
        } else {
            //cant update other user email
            return 'CANT_UPDATE_OTHER_USER_EMAIL_OR_PHONE';
        }
    }

    // if (notifications_settings) {
    //     delete attrs.notifications_settings;
    //
    //     let item = notifications_settings.data || notifications_settings;
    //     if (item.id) {
    //         item = await updateNotificationSetting(item);
    //     } else {
    //         item = await insertNotificationSetting(item);
    //     }
    //
    //     attrs.notifications_settings_id = item.id;
    // }

    return updateMutationImpl({
        checkLogin,
        mutation,
        id: attrs.id,
        attrs,
    });
};
