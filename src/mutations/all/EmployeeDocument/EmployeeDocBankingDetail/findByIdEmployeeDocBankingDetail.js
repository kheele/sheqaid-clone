/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployeeDocBankingDetail} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeDocBankingDetailQuery($id: bigint) {
    hr_employees_banking_details_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          is_default
          name

          account_num
          branch
          code
          doc
          employee_id
          employee{
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
