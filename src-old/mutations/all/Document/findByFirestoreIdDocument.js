/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityDocument} from "../../types.d.ts";
//2022-11-17T11:18:03.000Z
// 2
const query = graphql`
  query findByFirestoreIdDocumentQuery($firestore_id: String) {
    sheq_documents_connection(where: {firestore_id: {_eq: $firestore_id}}) {
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
export default (input: string) =>
    input && findOneMutationImpl({ query, variables: {firestore_id: input} });
