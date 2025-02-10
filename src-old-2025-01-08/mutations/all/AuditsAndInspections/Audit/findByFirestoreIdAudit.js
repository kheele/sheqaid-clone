/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByFirestoreIdAuditQuery($firestore_id: String) {
    sheq_compliance_audits_connection(where: {firestore_id: {_eq: $firestore_id}}) {
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
export default (input: string) =>
    input && findOneMutationImpl({ query, variables: {firestore_id: input} });
