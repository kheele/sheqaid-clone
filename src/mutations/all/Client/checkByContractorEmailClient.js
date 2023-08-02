/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityClient} from "mutations/types.d.ts";

// 2
const query = graphql`
  query checkByContractorEmailClientQuery($id: bigint, $contractor_email: String) {
    default_clients_connection(where: {id: {_neq: $id}, contractor_email: {_eq: $contractor_email}}) {
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
export default async ({id, contractor_email}) =>
    findOneMutationImpl({ query, variables: {id, contractor_email} });
