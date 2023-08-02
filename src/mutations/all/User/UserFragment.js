/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";

// 2
export const UserFragment = graphql`
    fragment UserFragment on default_users {
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
`;
