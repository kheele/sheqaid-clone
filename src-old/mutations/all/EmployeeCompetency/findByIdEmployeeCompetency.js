/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployeeCompetency} from "../../types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeCompetencyQuery($id: bigint) {
    hr_employees_docs_competencies_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          employee {
            id
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
