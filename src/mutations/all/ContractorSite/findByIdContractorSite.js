/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityContractorSite} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdContractorSiteQuery($id: bigint) {
    default_sites_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
