/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdIncidentVehicleQuery($id: bigint) {
    sheq_incident_investigation_vehicles_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          incident_id
          incident{
            id
          }
          driver_id
          driver{
            id
            fname
            lname
            email
            phone
            id_num
            passport_num
            job_position{
              id
              name
            }
            supervisor{
              id
              fname
              lname
              email
              phone
              id_num
              passport_num
              job_position{
                id
                name
              }
            }
          }
          driver_other_id
          driver_other{
            id
            fname
            lname
            email
            phone
            id_num
            passport_num
            job_position{
              id
              name
            }
          }
          driver_dob
          driver_gender
          address
          email
          phone
          licence_num
          licence_expiry
          licence_years
          vehicle_make
          vehicle_model
          vehicle_year
          vehicle_color
          vehicle_reg_num
          vehicle_fleet_num
          vehicle_reg_date
          vehicle_trip_type
          vehicle_load_type
          was_3rd_party_involved
          are_3rd_party_details_available
          third_party_fname
          third_party_lname
          third_party_address
          third_party_email
          third_party_phone
          did_driver_admit_liability
          did_someone_else_admit_liability
          someone_else_admit_liability_name
          liability_admitted_to_name
          third_party_opinion
          is_infringement_issued
          penalty_num
          issuing_authority
          issuing_officer
          type_of_breach
          addressee_issued_to_name
          addressee_name_or_entity
          addressee_amount
          addressee_due_date
          did_police_attend_scene
          ref_or_report_num
          officer_name
          officer_station
          collision_reported_to_police_station
          have_charges_been_laid
          nature_of_charges
          who_laid_charges
          who_were_nature_charges_laid_against
          third_party_document_list{
            id
            doc
            vehicle_details_id
            vehicle_details{
              id
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
