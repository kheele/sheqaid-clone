/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import { EntityEmployeeExpense } from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeExpenseQuery($id: bigint) {
    hr_employees_docs_expenses_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          removed
          category
          date
          amount
          status
          paid_with
          comments
          date_submitted
          date_approved
          date_compensated
          currency_country{
            id
            name
            currency
            currency_name
            iso2
          }
          employee{
            id
            fname
            lname
            phone
            email
            id_num
            passport_num
          }
          approver{
            id
            fname
            lname
            phone
            email
            id_num
            passport_num
          }
          compensator{
            id
            fname
            lname
            phone
            email
            id_num
            passport_num
          }
          company {
            id
            name
          }
          client {
            id
            name
          }
          project {
            id
            name
          }
          site {
            id
            name
          }
        }
      }
    }
  }
`;
//firestore_id
// 3,
export default async (input: number) =>
  findOneMutationImpl({ query, variables: { id: input } });
