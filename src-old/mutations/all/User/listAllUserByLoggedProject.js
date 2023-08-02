/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllUserByLoggedProjectQuery($project_id: bigint) {
    default_users_connection(where: {project_id: {_eq: $project_id}}) {
      edges {
        node {
          ...UserFragment
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: number) =>
    listMutationImpl({ query, variables: {project_id: input} });
