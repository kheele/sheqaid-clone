/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllSiteByLoggedProjectQuery($project_id: bigint) {
    default_sites_connection(where: {project_id: {_eq: $project_id}}) {
      edges {
        node {
          id
          created_at
          name
          address
        }
      }
    }
  }
`;
//firestore_id
// 3
export default () =>
    listMutationImpl({ query, variables: {project_id: 1} });
