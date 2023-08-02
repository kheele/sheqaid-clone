/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdIncidentTestTypeQuery($id: bigint) {
    sheq_incident_investigation_test_type_list_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          name
          incident_id
          incident{
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
