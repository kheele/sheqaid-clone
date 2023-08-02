/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityContractorUser} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByFirestoreIdContractorUserQuery($firestore_id: String) {
    default_contractor_users_connection(where: {auth_id: {_eq: $firestore_id}}) {
      edges {
        node {
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
          company {
            id
            name
          }
          site {
            id
            name
            client {
              id
              name
            }
            project {
              id
              name
            }
          }
          contractor {
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
    input && findOneMutationImpl({ query, variables: {firestore_id: input} });
