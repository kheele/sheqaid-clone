/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntitySector} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByNameIncidentInjuryQuery($name: String) {
    sheq_incident_investigation_injury_list_connection(where: {name: {_eq: $name}}) {
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
    input && findOneMutationImpl({ query, variables: {name: input} });
