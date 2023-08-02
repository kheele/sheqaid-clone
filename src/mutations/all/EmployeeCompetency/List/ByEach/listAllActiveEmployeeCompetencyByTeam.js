/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "mutations/listMutationImpl";

// 2
const query = graphql`
  query listAllActiveEmployeeCompetencyByTeamQuery($team_id: bigint) {
    hr_employees_docs_competencies_connection(where: {removed: {_eq: false}, employee: {team_id: {_eq: $team_id}}}) {
      edges {
        node {
          id
          created_at
          accreditation_num
          competency_type
          type
          doc
          issued_date
          expiry_date
          expiry_updated
          employee{
            id
            fname
            lname
            phone
            email
            id_num
            passport_num
          }
          training{
            id
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
export default (input: number) : [EntityEmployee] =>
    listMutationImpl({ query, variables: {team_id: input} });
