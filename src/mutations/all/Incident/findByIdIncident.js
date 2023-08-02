/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityIncident} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdIncidentQuery($id: bigint) {
    sheq_incident_investigation_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
#          created_at
          
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
