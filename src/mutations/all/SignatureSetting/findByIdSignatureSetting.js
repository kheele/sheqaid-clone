/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntitySignatureSetting} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdSignatureSettingQuery($id: bigint) {
    default_signature_settings_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          is_employee_owning
          
          signature_settings_list_connection{
            edges {
              node{
                id
                signature_setting{
                  id
                }
                employee{
                  id
                  fname
                  lname
                  full_name
                  email
                  phone
                  job_position{
                    id
                    name
                  }
                }
                job_position{
                  id
                  name
                }
              }
            }
            
          }
          
          plugin{
            id
            key
            title
          }
          module{
            id
            key
            title
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
          contractor {
            id
            name
          }
          contractor_site {
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
