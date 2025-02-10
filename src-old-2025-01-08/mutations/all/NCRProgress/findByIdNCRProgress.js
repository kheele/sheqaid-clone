/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityNCRProgress} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdNCRProgressQuery($id: bigint) {
    sheq_non_conformance_progress_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
            id
            outstanding
            notes
            date
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
