/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllContractorUserByLoggedSiteQuery($contractor_id: bigint, $site_id: bigint) {
    default_contractor_users_connection(where: {contractor_id: {_eq: $contractor_id}, contractor_site_id: {_eq: $site_id}}) {
      edges {
        node {
          id
#          ...UserFragment
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (contractor_id: number, site_id: number) =>
    listMutationImpl({ query, variables: {contractor_id, site_id} });
