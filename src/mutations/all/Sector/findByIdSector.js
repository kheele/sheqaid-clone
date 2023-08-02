/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntitySector} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdSectorQuery($id: bigint) {
    default_sectors_connection(where: {id: {_eq: $id}}) {
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
    findOneMutationImpl({ query, variables: {id: input} });
