import GQLClient from "graphql/GQLClient";
import {employee_personal_details_fragment, orgs_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../../../../Query/Utils";

//<editor-fold desc="contract_inc_fragment">
const contract_inc_fragment = `
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
    ${orgs_fragment}
`;
//</editor-fold>

export default (
  {
    offset = 0,
    limit = 50,
    //
    view = 'Employee',
    mon, mon2, mon3,
    expiry_date = 'ALL',
    date_range,
    removed = false,
    //
    department_id,
    job_position_id,
    team_id,
    supervisor_id,
    employee_id,
    //
    contract_type,
    payment_type,
    salary_interval,
    //
    site_id, project_id, client_id,
    //
    exact_orgs = true,
  }
) => {
  const {filter, filterEmployee} = getVariablesAndQueryConfig({
    view,
    mon, mon2, mon3,
    expiry_date,
    date_range,
    //
    department_id,
    job_position_id,
    team_id,
    supervisor_id,
    employee_id,
    //
    contract_type,
    payment_type,
    salary_interval,
    //
    site_id, project_id, client_id,
    //
    exact_orgs,
    //
    isContract: true,
  });

  if (view === 'Employee') {
    //<editor-fold desc="ByGroup">
    return GQLClient
    .query({
      query: `
                    query listAllByGroupContractByLoggedQuery {
                        hr_employees(
                            where: {
                                contract_list_aggregate: {count: {predicate: {_gt: 0}}}, 
                                contract_list: {removed: {_eq: ${removed}}${filter}}
                                ${filterEmployee}
                            },
                            order_by: {lname: asc},
                            offset: ${offset},
                            ${limit > 0 ? `,limit: ${limit}` : ''}
                        ) {
                            ${employee_personal_details_fragment}
                            contract_list(where: {removed: {_eq: ${removed}}}, order_by: {contract_details_aggregate: {max: {expiry_date: desc_nulls_last}}}){
                                ${contract_inc_fragment}
                            }
                            contract_list_no_expiry_aggregate:contract_list_aggregate(where: {
                                removed: {_eq: ${removed}}, contract_details: {expiry_date: {_is_null: true}}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            contract_list_expired_aggregate:contract_list_aggregate(where: {
                                removed: {_eq: ${removed}}, contract_details: {expiry_date: {_lte: "now()"}}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            contract_list_mon_expiry_aggregate:contract_list_aggregate(where: {
                                removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "now()", _lte: "${mon}"}}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            contract_list_2mon_expiry_aggregate:contract_list_aggregate(where: {
                                removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "${mon}", _lte: "${mon2}"}}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            contract_list_3mon_expiry_aggregate:contract_list_aggregate(where: {
                                removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            contract_list_4mon_expiry_aggregate:contract_list_aggregate(where: {
                                removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "${mon3}"}}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            ${orgs_fragment}
                        }
                    }
                `,
    });
    //</editor-fold>
  } else {
    //<editor-fold desc="ByEach">
    return GQLClient
    .query({
      query: `
                    query listAllByEachContractByLoggedQuery {
                        hr_employees_docs_contracts(
                            where: {
                                removed: {_eq: ${removed}}, 
                                ${filter}
                                ${filterEmployee}
                            },
                            order_by: {employee: {lname: asc}},
                            offset: ${offset},
                            ${limit > 0 ? `,limit: ${limit}` : ''}
                        ) {
                            id
                            created_at
                            doc
                            job_profile_doc
                            expiry_updated
                            removed
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
                            employee{
                                ${employee_personal_details_fragment}
                                contract_list(where: {removed: {_eq: ${removed}}}){
                                    id
                                    contract_details{
                                        expiry_date
                                        end_of_trial_period
                                    }
                                }
                            }
                            ${orgs_fragment}
                        }
                    }
                `,
    });
    //</editor-fold>
  }
};
