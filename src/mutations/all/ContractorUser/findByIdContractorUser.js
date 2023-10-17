/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityContractorUser} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdContractorUserQuery($id: bigint) {
    default_contractor_users_connection(where: {id: {_eq: $id}}) {
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
          client {
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
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
