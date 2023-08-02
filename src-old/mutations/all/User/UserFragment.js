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
        notifications_settings {
            id
            receive_asset_management_notifs
            receive_chemicals_management_notifs
            receive_contractor_management_notifs
            receive_covid_positive_case_notifs
            receive_covid_return_to_work_notifs
            receive_covid_screening_notifs
            receive_covid_vulnerability_notifs
            receive_expired_docs_notifs
            receive_incident_management_notifs
            receive_non_conformance_management_notifs
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
