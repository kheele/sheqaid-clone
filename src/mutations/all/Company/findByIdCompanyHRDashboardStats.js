/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityCompany} from "mutations/types.d.ts";

// 2
const query = graphql`
    query findByIdCompanyHRDashboardStatsQuery($id: bigint, $mon: date, $mon2: date, $mon3: date) {
        default_companies_connection(where: {id: {_eq: $id}}) {
            edges {
                node {
                    id
                    employee_active_list_aggregate:employee_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    employee_removed_list_aggregate:employee_list_aggregate(where: {removed: {_eq: true}}){
                        aggregate{
                            count
                        }
                    }
                    supervisor_list_aggregate:employee_list_aggregate(where: {
                        removed: {_eq: false}, supervisor_employee_list_aggregate: {count: {filter: {removed: {_gt: false}}, predicate: {_gt: 0}}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    
#                    competency_list
                    competency_list_active_aggregate:competency_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    competency_list_no_expiry_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    competency_list_expired_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    competency_list_mon_expiry_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
                    }){
                        aggregate{
                            count
                        }
                    }
                    competency_list_2mon_expiry_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
                    }){
                        aggregate{
                            count
                        }
                    }
                    competency_list_3mon_expiry_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }
                    competency_list_4mon_expiry_aggregate:competency_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    contract_list
                    contract_list_active_aggregate:contract_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    contract_list_no_expiry_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_is_null: true}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    contract_list_expired_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_lte: "now()"}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    contract_list_mon_expiry_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_gt: "now()", _lte: $mon}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    contract_list_2mon_expiry_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon, _lte: $mon2}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    contract_list_3mon_expiry_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon2, _lte: $mon3}}
                    }){
                        aggregate{
                            count
                        }
                    }
                    contract_list_4mon_expiry_aggregate:contract_list_aggregate(where: {
                        removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon3}}
                    }){
                        aggregate{
                            count
                        }
                    }

                    #job_appointment_list
                    job_appointment_list_active_aggregate:job_appointment_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_no_expiry_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_expired_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
                    }){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_2mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
                    }){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_3mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }
                    job_appointment_list_4mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    counselling_list
                    counselling_list_active_aggregate:counselling_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_no_expiry_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_expired_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_mon_expiry_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
                    }){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_2mon_expiry_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
                    }){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_3mon_expiry_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }
                    counselling_list_4mon_expiry_aggregate:counselling_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    leave_list
                    leave_list_active_aggregate:leave_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    leave_list_no_expiry_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    leave_list_expired_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    leave_list_mon_expiry_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
                    }){
                        aggregate{
                            count
                        }
                    }
                    leave_list_2mon_expiry_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
                    }){
                        aggregate{
                            count
                        }
                    }
                    leave_list_3mon_expiry_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }
                    leave_list_4mon_expiry_aggregate:leave_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    license_list
                    license_list_active_aggregate:license_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    license_list_no_expiry_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    license_list_expired_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    license_list_mon_expiry_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
                    }){
                        aggregate{
                            count
                        }
                    }
                    license_list_2mon_expiry_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
                    }){
                        aggregate{
                            count
                        }
                    }
                    license_list_3mon_expiry_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }
                    license_list_4mon_expiry_aggregate:license_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    medical_list
                    medical_list_active_aggregate:medical_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    medical_list_no_expiry_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    medical_list_expired_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    medical_list_mon_expiry_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
                    }){
                        aggregate{
                            count
                        }
                    }
                    medical_list_2mon_expiry_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
                    }){
                        aggregate{
                            count
                        }
                    }
                    medical_list_3mon_expiry_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }
                    medical_list_4mon_expiry_aggregate:medical_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    warning_list
                    warning_list_active_aggregate:warning_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    warning_list_no_expiry_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    warning_list_expired_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    warning_list_mon_expiry_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
                    }){
                        aggregate{
                            count
                        }
                    }
                    warning_list_2mon_expiry_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
                    }){
                        aggregate{
                            count
                        }
                    }
                    warning_list_3mon_expiry_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }
                    warning_list_4mon_expiry_aggregate:warning_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }

#                    work_permit_list
                    work_permit_list_active_aggregate:work_permit_list_aggregate(where: {removed: {_eq: false}}){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_no_expiry_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_is_null: true}
                    }){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_expired_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_lte: "now()"}
                    }){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_mon_expiry_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
                    }){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_2mon_expiry_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
                    }){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_3mon_expiry_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }
                    work_permit_list_4mon_expiry_aggregate:work_permit_list_aggregate(where: {
                        removed: {_eq: false}, expiry_date: {_gt: $mon3}
                    }){
                        aggregate{
                            count
                        }
                    }
                    
                    team_list_aggregate{
                        aggregate{
                            count
                        }
                    }
                    department_list_aggregate{
                        aggregate{
                            count
                        }
                    }
                    job_category_list_aggregate{
                        aggregate{
                            count
                        }
                    }
                    job_position_list_aggregate{
                        aggregate{
                            count
                        }
                    }
                }
            }
        }
    }
`;

// 3
export default async ({input, mon, mon2, mon3}) =>
    findOneMutationImpl({query, variables: {id: input, mon, mon2, mon3}});
