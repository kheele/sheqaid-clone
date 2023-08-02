/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllClientByLoggedCompanyQuery($company_id: bigint) {
    default_clients_connection(where: {company_id: {_eq: $company_id}}) {
      edges {
        node {
          id
          created_at
          name
          address
          project_list_aggregate {
            aggregate {
              count
            }
          }
          site_list_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default () =>
    listMutationImpl({ query, variables: {company_id: 1} });
