/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllSectorByLoggedClientQuery($client_id: bigint) {
    default_sectors_connection(where: {client_id: {_eq: $client_id}}) {
      edges {
        node {
          id
          created_at
          name
        }
      }
    }
  }
`;
//firestore_id
// 3
export default () =>
    listMutationImpl({ query, variables: {client_id: 1} });
