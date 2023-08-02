/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityNCR} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdNCRQuery($id: bigint) {
    sheq_non_conformances_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
            id
            created_at
            comments
            completed_date
            desc
            due_date
            process
            remarks
            type
            source
            priority
            allocation
            additional_notes
            status_acceptance
            status_progress
            result
            document_list(where: {type: {_eq: "Document Incident"}}){
                id
                doc
            }
            document_proof_list:document_list(where: {type: {_eq: "Document Proof"}}){
                id
                doc
            }
            progress_list{
                id
                outstanding
                notes
                date
            }
            responsible_party_list {
              id
              value
            }
            assigned_job_position_list {
              id
              job_position{
                id
                name
              }
            }
            assigned_person_list {
              id
              employee{
                id
                fname
                lname
                full_name
                email
                phone
                id_num
                passport_num
              }
            }
            approving_person{
                id
                lname
                fname
                email
                phone
            }
#            responsible_person{
#                id
#                lname
#                fname
#                email
#                phone
#            }
            selected_source_site {
                id
                name
                project{
                    id
                    name
                }
                client{
                    id
                    name
                }
            }
            selected_source_incident {
                id
            }
            selected_source_inspection {
                id
            }
            selected_source_compliance_audit {
                id
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
export default async (input: number) =>
  input && findOneMutationImpl({ query, variables: {id: input} });
