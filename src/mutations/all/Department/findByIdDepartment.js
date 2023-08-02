/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityDepartment} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdDepartmentQuery($id: bigint) {
    default_departments_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          name
          ppe_list_aggregate{
            aggregate{
              count
            }
          }
          employee_list_aggregate{
            aggregate{
              count
            }
          }
          responsible_document_list_aggregate{
            aggregate{
              count
            }
          }
          company{
            id
            name
          }
          client{
            id
            name
          }
          project{
            id
            name
          }
          site{
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
