/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import checkByUsernameUser from "../User/checkByUsernameUser";
import findByPhoneUser from "../User/findByPhoneUser";
import {Dates} from "utils/Dates";
import storage from "../../../storage/Storage";
import moduleManager from "../../../app/ModuleManager";

// 2
const mutation = graphql`
    mutation signUpMutation($object: default_users_insert_input!) {
        insert_default_users_one(
            object: $object
        ) {
            id
            auth_id
            created_at,
            fname
            lname
            username
            phone
            profile_pic
            auth_type
            has_biometric
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
export default async (input) => {
    const {
        uid,
        customToken,
        fname,
        lname,
        username,
        phone,
        password,
        company, company: {
            data: {
                account_type,
                consultant,
                has_projects,
                name,
                phone: company_phone,
                email,
                address,
                category_id,
                country_iso2,
                zone_id,
                city_id,
            }
        }
    } = input;

    input.notifications_settings = {
        data: {
            receive_expired_docs_notifs: true,
            //
            receive_contractor_management_notifs: true,
            receive_asset_management_notifs: true,
            receive_incident_management_notifs: true,
            receive_inspection_management_notifs: true,
            receive_chemicals_management_notifs: true,
            receive_non_conformance_management_notifs: true,
            receive_training_management_notifs: true,
            //
            receive_employees_profile_notifs: true,
            receive_employees_expired_docs_medicals: true,
        }
    };

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

    let existingUser = await checkByUsernameUser(username);
    if (existingUser) {
        return "EMAIL_DUP";
    }
    existingUser = await findByPhoneUser(phone);
    if (existingUser) {
        return "PHONE_DUP";
    }

    delete input.password;
    delete input.uid;
    delete input.customToken;

    if (account_type === 'Trial') {
        company.data.trial_start_date = Dates.formatDateSQL(new Date());
        company.data.trial_max_days = 30;
    }

    const module_list = moduleManager.moduleListInstalledAll.map(({id}) => ({module_id: id}));
    company.data.module_list = {
        data: module_list,
    };

    const newUser = await createMutationImpl({checkLogin: false, mutation, input});

    if (newUser) {
        return await workers.emit("users/accounts/signup", {newUser, password, uid, customToken});
    }
};
