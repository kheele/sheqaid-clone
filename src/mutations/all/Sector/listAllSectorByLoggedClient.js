/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllSectorByLoggedClientQuery($client_id: bigint) {
    default_sectors_connection(where: {client_id: {_eq: $client_id}}, order_by: {name: asc}) {
      edges {
        node {
          id
          created_at
          name
          desc
          sector_owner
          training_course_list_aggregate{
            aggregate{
              count
            }
          }
          company_list_aggregate{
            aggregate{
              count
            }
          }
          client_list_aggregate{
            aggregate{
              count
            }
          }
          company {
            id
            name
          }
          client {
            id
            name
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    listMutationImpl({ query, variables: {client_id: input} });
