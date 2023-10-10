/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTrainingToolboxTalkSubjectCategory} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdTrainingToolboxTalkSubjectCategoryQuery($id: bigint) {
    sheq_training_toolbox_talk_subject_categories_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          name
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
