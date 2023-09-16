import GQLClient from "graphql/GQLClient";
import {orgs_fragment, employee_personal_details_fragment} from "../../../../Query/Fragments";
import {getVariablesAndQueryConfig} from "../../../../Query/Utils";

//<editor-fold desc="warning_inc_fragment">
const warning_inc_fragment = `
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
            ${employee_personal_details_fragment}
        }
    }
    issued_by{
        ${employee_personal_details_fragment}
    }
    
    employee{
        id
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
    date,
    removed = false,
    //
    department_id,
    job_position_id,
    team_id,
    supervisor_id,
    employee_id,
    //
    issued_by_id,
    witness_id,
    type,
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
    date,
    //
    department_id,
    job_position_id,
    team_id,
    supervisor_id,
    employee_id,
    //
    issued_by_id,
    witness_id,
    type,
    //
    site_id, project_id, client_id,
    //
    exact_orgs
  });

  if (view === 'Employee') {
    //<editor-fold desc="ByGroup">
    return GQLClient
    .query({
      query: `
                    query listAllByGroupWarningByLoggedQuery {
                        hr_employees(
                            where: {
                                warning_list_aggregate: {count: {predicate: {_gt: 0}}}, 
                                warning_list: {removed: {_eq: ${removed}}${filter}}
                                ${filterEmployee}
                            }
                            order_by: {lname: asc},
                            offset: ${offset},
                            ${limit > 0 ? `,limit: ${limit}` : ''}
                        ) {
                            ${employee_personal_details_fragment}
                            warning_list(where: {removed: {_eq: ${removed}}}, order_by: {expiry_date: desc_nulls_last}){
                                ${warning_inc_fragment}
                            }
                            warning_list_no_expiry_aggregate:warning_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_is_null: true}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            warning_list_expired_aggregate:warning_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_lte: "now()"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            warning_list_mon_expiry_aggregate:warning_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            warning_list_2mon_expiry_aggregate:warning_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            warning_list_3mon_expiry_aggregate:warning_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            warning_list_4mon_expiry_aggregate:warning_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon3}"}
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
                    query listAllByEachWarningByLoggedQuery {
                        hr_employees_docs_warnings(
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
                                    ${employee_personal_details_fragment}
                                }
                            }
                            issued_by{
                                ${employee_personal_details_fragment}
                            }
                            employee{
                                ${employee_personal_details_fragment}
                                warning_list(where: {removed: {_eq: ${removed}}}){
                                    id
                                    expiry_date
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
