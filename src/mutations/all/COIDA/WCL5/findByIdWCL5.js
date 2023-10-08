/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityWCL5} from "mutations/types.d.ts";
import {Dates} from "../../../../utils/Dates";

// 2
const query = graphql`
  query findByIdWCL5Query($id: bigint) {
    coida_claims_wcl_5_connection(where: {id: {_eq: $id}}) {
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
          
          #4. Medical Practitioner/Chiropractor Consultation Details
          operation_procedure_test_carried_out_and_dates
          prognosis_and_further_treatment
          employee_been_fit_normal_work_date
          employee_likely_to_be_fit_normal_work_date
          employee_condition_became_stabilised_yes_or_no
          present_permanent_anatomical_defect_or_impairment
          
          #5. Medical Practitioner/Chiropractor Declaration
          practioner_signature
          practioner_signature_name
          practioner_signature_date
          practioner_addr
          practioner_practice_num
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
