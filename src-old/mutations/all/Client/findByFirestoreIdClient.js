/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityClient} from "../../types.d.ts";

// 2
const query = graphql`
  query findByFirestoreIdClientQuery($firestore_id: String) {
    default_clients_connection(where: {firestore_id: {_eq: $firestore_id}}) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

// 3
export default (input: string) =>
    input && findOneMutationImpl({ query, variables: {firestore_id: input} });
