/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {employee_personal_details_fragment} from "../../../../../oracle-server/src/graphql/Fragments";

// 2
const query = graphql`
  query findByIdAuditItemQuery($id: bigint) {
    sheq_compliance_audits_items_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          id
          audit_id
          audit{
            id
          }
          element
          sub_element
          target_date
          due_date
          audit_findings
          audit_summary
          possible_score
          achieved_score
          comments
          compliance
          responsible_person{
            id
            created_at
            profile_pic
            fname
            lname
            full_name
            dob
            sex
            phone
            email
            id_num
            passport_num
            employment_num
            employment_date
            removed
            job_position{
              id
              name
            }
            department{
              id
              name
            }
            linked_user_id
            linked_user{
              id
              auth_id
              created_at
              profile_pic
              fname
              lname
              full_name
              phone
              username
            }
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
