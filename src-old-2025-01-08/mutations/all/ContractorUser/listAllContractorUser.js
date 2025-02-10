/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllContractorUserQuery {
    default_contractor_users_connection {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          permissions_module_list{
            id
          }
          permissions_other_list{
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
    listMutationImpl({ query, checkLogin: false, });
