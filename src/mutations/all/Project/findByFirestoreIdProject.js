/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityProject} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByFirestoreIdProjectQuery($firestore_id: String) {
    default_projects_connection(where: {firestore_id: {_eq: $firestore_id}}, first: 1) {
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
export default async (input: string) =>
    input && findOneMutationImpl({ query, variables: {firestore_id: input} });
