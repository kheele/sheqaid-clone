/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdIncidentSeverityQuery($id: bigint) {
    sheq_incident_investigation_severity_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          consequence
          likelihood
          risk_rating
          risk_rating_score
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
