/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployee} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllEmployeeByTeamQuery($team_id: bigint) {
    hr_employees_connection(where: {team_id: {_eq: $team_id}}) {
      edges {
        node {
          ...EmployeeFragment
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: number) : [EntityEmployee] =>
    listMutationImpl({ query, variables: {team_id: input} });
