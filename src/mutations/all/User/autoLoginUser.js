/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";

// 2
const query = graphql`
  query autoLoginUserQuery($auth_id: String) {
    default_users_connection(where: {auth_id: {_eq: $auth_id}}) {
      edges {
        node {
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
            created_at
            account_type
            address
            business_id
            consultant
            email
            name
            no_projects
            phone
            profile_pic
            sector_list {
              id
              sector {
                id
                name
              }
            }
            module_list {
              id
              price
              module {
                id
                borderColor
                desc
                discount
                faIconLeft
                faIconRight
                has_update
                hover
                key
                price
                sort
                status
                svgIconLeft
                svgIconRight
                title
                plugin{
                  key
                }
              }
            }
            zone {
              id
              name
            }
            country {
              id
              name
            }
            category {
              id
              name
            }
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
    }
  }
`;
//firestore_id
// 3
export default async (input: string) =>
    input && findOneMutationImpl({ query, variables: {auth_id: input} });
