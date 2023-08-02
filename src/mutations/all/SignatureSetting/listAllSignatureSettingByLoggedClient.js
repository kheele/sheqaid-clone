/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllSignatureSettingByLoggedClientQuery($client_id: bigint) {
    default_signature_settings_connection(where: {client_id: {_eq: $client_id}}) {
      edges {
        node {
          id
          created_at
          is_employee_owning
          module {
            id
          }
          plugin {
            id
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    listMutationImpl({ query, variables: {client_id: input} });
