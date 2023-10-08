/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityAnnexture1} from "mutations/types.d.ts";
import {Dates} from "../../../../utils/Dates";

// 2
const query = graphql`
  query findByIdAnnexture1Query($id: bigint) {
    coida_claims_annexture_1_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          
          totalFieldCount
          totalFieldMax
          
          #A. Recording Of Incident
          company_name
          id_num
          accident_date
          accident_time
          part_of_body_affected
          effect_on_person
          expected_period_of_disablement
          disease_desc
          process
          incident_reported_compensationcommissioner__provincial_director
          incident_reported_police
          saps_office
          saps_reference
          substance_exposed_to
          
          #B. Incident Investigation
          investigator{
            id
            full_name
          }
          investigator_other{
            id
            full_name
          }
          investigation_date
          investigator_designation
          incident_desc
          incident_cause
          steps_to_prevent_recurrence
          investigator_signature
          investigator_signature_date
          
          #C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident
          employer_preventative_action_for_recurrence_of_similar_incident
          employer_signature
          employer_signature_date
          
          #D. Remarks By Health & Safety Committee
          health_and_safety_committee_remarks
          chairperson_of_health_and_safety_committee_signature
          chairperson_of_health_and_safety_committee_signature_date
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
