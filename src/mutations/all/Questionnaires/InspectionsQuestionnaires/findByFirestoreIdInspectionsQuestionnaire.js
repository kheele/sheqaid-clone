/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityInspectionsQuestionnaire} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByFirestoreIdInspectionsQuestionnaireQuery($firestore_id: String) {
    default_contractor_questionnaires_connection(where: {firestore_id: {_eq: $firestore_id}}) {
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
