/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTrainingManual} from "../../types.d.ts";

// 2
const query = graphql`
  query findByIdTrainingManualQuery($id: bigint) {
    sheq_training_manuals_connection(where: {id: {_eq: $id}}) {
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
export default (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
