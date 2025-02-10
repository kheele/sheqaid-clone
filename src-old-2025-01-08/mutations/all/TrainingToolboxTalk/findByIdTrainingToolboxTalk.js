/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTrainingToolboxTalk} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdTrainingToolboxTalkQuery($id: bigint) {
    sheq_training_toolbox_talks_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          training_frequency
          subject_category
          subject{
            id
            name
          }
          
          contractor{
            id
            name
          }
          contractor_site {
            id
            name
          }
          
          client {
            id
            name
          }
          project {
            id
            name
          }
          site {
            id
            name
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
