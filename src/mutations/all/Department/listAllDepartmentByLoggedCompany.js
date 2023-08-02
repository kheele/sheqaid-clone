/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllDepartmentByLoggedCompanyQuery($company_id: bigint) {
    default_departments_connection(where: {company_id: {_eq: $company_id}}, order_by: {name: asc}) {
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
    listMutationImpl({ query, variables: {company_id: input} });
