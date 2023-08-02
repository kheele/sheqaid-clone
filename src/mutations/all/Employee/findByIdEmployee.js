/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeQuery($id: bigint) {
    hr_employees_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at,
          fname
          lname
          full_name
          email
          phone
          dob
          sex
          id_num
          passport_num
          profile_pic
          employment_num
          employment_date

          job_observation_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          job_observation_list{
            id
            name
          }
          
          banking_detail_list_aggregate{
            aggregate{
              count
            }
          }
          banking_detail_list{
            id
            created_at
            name
            account_num
            code
            branch
            doc
            is_default
          }
          living_address_list_aggregate{
            aggregate{
              count
            }
          }
          living_address_list{
            id
            created_at
            local_address
            street_address
            doc
            is_default
            country{
              id
              name
            }
            zone{
              id
              name
            }
            city{
              id
              name
            }
          }
          dependent_list_aggregate{
            aggregate{
              count
            }
          }
          dependent_list{
            id
            fname
            lname
            dob
            gender
          }
          next_of_kin_list_aggregate{
            aggregate{
              count
            }
          }
          next_of_kin_list{
            id
            fname
            lname
            phone1
            phone2
            relationship
            
          }

          training_course_list_aggregate: training_plan_list_aggregate {
            aggregate {
              count(distinct: true, columns: course_id)
            }
          }
          training_course_list: training_plan_list(distinct_on: [course_id]) {
            id
            course{
              id
              name
              unit_standard
              unit_standard_desc
            }
          }
          training_plan_list_aggregate: training_plan_list_aggregate {
            aggregate {
              count
            }
          }
          training_plan_list{
            id
            created_at
            completion_status
            result_status
            result

            year
            course {
              id
              name
            }
            training {
              id
              course {
                id
                name
              }
            }
          }

          training_matrix_list_aggregate: training_plan_list_aggregate {
            aggregate {
              count(distinct: true, columns: training_id)
            }
          }
          training_matrix_list: training_plan_list(distinct_on: [training_id]) {
            id
            training {
              id
              date_range_start
              date_range_end
              training_standard
              unit_standard
              unit_standard_desc
              credits
              nqf_level
              requirement
              provider_requirement
              requirement_legal
              training_frequency
              cost
              course {
                id
                name
                unit_standard
                unit_standard_desc
              }
            }
          }

          competency_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          competency_list(where: {removed: {_eq: false}}){
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
            }
            training{
              id
              course{
                id
                name
              }
            }
          }
          contract_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          contract_list(where: {removed: {_eq: false}}){
            id
            created_at
            doc
            job_profile_doc
            expiry_updated
            removed
            employee{
              id
            }
            contract_details{
              id
              contract_type
              daily_working_hours
              end_of_trial_period
              end_time
              expiry_date
              notes
              start_date
              start_time
            }
            salary_info{
              id
              deductible_list{
                id
                created_at
                text
                value
              }
              payment_type
              salary
              salary_interval
              wage
            }
          }
          counselling_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          counselling_list(where: {removed: {_eq: false}}){
            id
            created_at
            doc
            corrective_actions
            counselling_hrs_to_complete
            expiry_date
            expiry_updated
            removed
            incident_desc
            reasons
            types
            responsible_person{
              id
              fname
              lname
              email
              phone
              id_num
              passport_num
              profile_pic
              employment_num
            }
            witness_list{
              id
              witness{
                id
                fname
                lname
                email
                phone
                id_num
                passport_num
                profile_pic
                employment_num
              }
            }
          }
          job_appointment_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          job_appointment_list(where: {removed: {_eq: false}}){
            id
            created_at
            removed
            notes
            doc
            date
            expiry_date
            expiry_updated
          }
          leave_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          leave_list(where: {removed: {_eq: false}}){
            id
            created_at
            days_booked
            due_to
            removed
            type
            employee_comments
            reason
            notes
            doc
            date
            expiry_date
            expiry_updated
          }
          license_list_aggregate{
            aggregate{
              count
            }
          }
          license_list(where: {removed: {_eq: false}}){
            id
            created_at
            removed
            notes
            doc
            date
            expiry_date
            expiry_updated
          }
          medical_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          medical_list(where: {removed: {_eq: false}}){
            id
            created_at
            removed
            annexture_3
            restrictions
            doc
            expiry_date
            expiry_updated
          }
          warning_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          warning_list(where: {removed: {_eq: false}}){
            id
            created_at
            removed
            type
            details
            employee_comments
            notes
            doc
            date
            expiry_date
            expiry_updated
            witness_list{
              id
              witness{
                id
                fname
                lname
                email
                phone
                id_num
                passport_num
                profile_pic
                employment_num
              }
            }
            issued_by{
              id
              fname
              lname
              email
              phone
              id_num
              passport_num
              profile_pic
              employment_num
            }
          }
          work_permit_list_aggregate{
            aggregate{
              count
            }
          }
          work_permit_list(where: {removed: {_eq: false}}){
            id
            created_at
            removed
            notes
            doc
            date
            expiry_date
            expiry_updated
          }

          document_list_aggregate{
            aggregate{
              count
            }
          }
          document_id_passport_list_aggregate:document_list_aggregate(where: {type: {_eq: "ID/Passport"}}){
            aggregate{
              count
            }
          }
          document_prdp_list_aggregate:document_list_aggregate(where: {type: {_eq: "PrDP"}}){
            aggregate{
              count
            }
          }
          document_list{
            id
            created_at
            expiry_date
            type
            desc
            doc
          }
          ppe_list_aggregate{
            aggregate{
              count
            }
          }
          ppe_list{
            id
            created_at
            assignment_status
            date_assigned
            ppe_condition
            ppe {
              id
              created_at
              name
              unit
              qty_received
              qty_issued
              qty_in_stock
              duration_type
              duration_value
              notes
              profile_pic
            }
          }
          trainer_training_list_aggregate:trainer_training_matrix_list_aggregate{
            aggregate{
              count
            }
          }
          trainer_training_list:trainer_training_matrix_list{
            id
            created_at
            competency_evaluation
            cost
            credits
            date_range_start
            date_range_end
            institution_conducting_training
            max_participants_per_course
            nqf_level
            provider_requirement
            requirement
            requirement_legal
            status
            training_frequency
            training_standard
            unit_standard
            unit_standard_desc

            trainer{
              id
              fname
              lname
              email
              phone
            }
            trainer_external{
              id
              fname
              lname
              email
              phone
            }
            trainer_job_position{
              id
              name
            }
            course{
              id
              name
            }
          }
          supervisor_employee_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          supervisor_employee_list(where: {removed: {_eq: false}}){
            id
            fname
            lname
            email
            phone
            id_num
            passport_num
            profile_pic
            employment_num
          }
          
          supervisor{
            id
            fname
            lname
            email
            phone
            id_num
            passport_num
            profile_pic
            employment_num
          }
          linked_user {
            id
            fname
            lname
            username
            phone
          }
          department {
            id
            name
          }
          job_position {
            id
            name
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
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
