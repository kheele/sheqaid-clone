/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTrainingManual} from "../../types.d.ts";

// 2
const query = graphql`
  query findByFirestoreIdTrainingManualQuery($firestore_id: String) {
    sheq_training_manuals_connection(where: {firestore_id: {_eq: $firestore_id}}) {
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
