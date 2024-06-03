/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllActiveEmployeeExpenseByTeamQuery($team_id: bigint) {
    hr_employees_docs_expenses_connection(where: {removed: {_eq: false}, employee: {team_id: {_eq: $team_id}}}) {
      edges {
        node {
          id
          created_at
          removed
          category
          date
          amount
          status
          currency_country{
            id
            name
            currency
            currency_name
            iso2
          }
          paid_with
          comments
          date_submitted
          date_approved
          date_compensated
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
// 3
export default async (input: number) : [EntityEmployee] =>
    listMutationImpl({ query, variables: {team_id: input} });
