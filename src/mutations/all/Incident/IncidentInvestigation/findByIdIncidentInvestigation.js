/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdIncidentInvestigationQuery($id: bigint) {
    sheq_incident_investigation_investigations_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
            id
            due_date
            document_list{
                id
            }
            investigation_finding_list{
                id
            }
            investigation_team_list{
                id
            }
            incident_list{
                id
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
