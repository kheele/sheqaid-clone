/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityWCL6} from "mutations/types.d.ts";
import {Dates} from "../../../../utils/Dates";

// 2
const query = graphql`
  query findByIdWCL6Query($id: bigint) {
    coida_claims_wcl_6_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          
          totalFieldCount
          totalFieldMax
          
          #1. General Details
          claim_number
          accident_date
          
          #2. Employer Details
          company_name
          company_str_addr
          company_str_addr_code
          
          #3. Employee Details
          id_num
          employee_str_addr
          employee_str_addr_code
          
          #4. Accident Details
          periods_employee_off_duty
          periods_employee_light_duty
          employee_light_duty_available_and_offered
          employee_perform_recommended_light_duty
          employee_perform_recommended_light_duty_not_performed_reason
          employee_perform_recommended_light_duty_performed_percentage
          employee_still_in_your_employment
          employee_left_my_service_date
          employee_present_address
  
          employee_receive_free_food_range
          employee_receive_free_quarters_range
          period_detained_in_hospital_range
          
          #5. Employer's Declaration
          employer_signature
          employer_signature_name
          employer_signature_date
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
