/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import listMutationImpl from "mutations/listMutationImpl";

// 2
const query = graphql`
  query listAllActiveEmployeeCompetencyByDepartmentQuery($department_id: bigint) {
    hr_employees_docs_competencies_connection(where: {removed: {_eq: false}, employee: {department_id: {_eq: $department_id}}}) {
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
            competency_list{
              id
              expiry_date
            }
          }
          training{
            id
            course{
              id
              name
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
    listMutationImpl({ query, variables: {department_id: input} });
