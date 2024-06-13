import GQLClient from "graphql/GQLClient";
import {employee_personal_details_fragment, orgs_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../../../../../Query/Utils";

//<editor-fold desc="work_permit_inc_fragment">
const work_permit_inc_fragment = `
    id
    created_at
    removed
    notes
    doc
    date
    expiry_date
    expiry_updated
    
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
    notes,
    //
    department_id,
    job_position_id,
    team_id,
    supervisor_id,
    employee_id,
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
    notes,
    //
    site_id, project_id, client_id,
    //
    exact_orgs
  });

  console.log('expiry_date', expiry_date);
  console.log('filter', filter);
  console.log('filterEmployee', filterEmployee);

  if (view === 'Employee') {
    //<editor-fold desc="ByGroup">
    return GQLClient
    .query({
      query: `
                    query listAllByGroupWorkPermitByLoggedQuery {
                        hr_employees(
                            where: {
                                work_permit_list_aggregate: {count: {predicate: {_gt: 0}}}, 
                                work_permit_list: {removed: {_eq: ${removed}}${filter}}
                                ${filterEmployee}
                            }
                            order_by: {lname: asc},
                            offset: ${offset},
                            ${limit > 0 ? `,limit: ${limit}` : ''}
                        ) {
                            ${employee_personal_details_fragment}
                            work_permit_list(where: {removed: {_eq: ${removed}}}, order_by: {expiry_date: desc_nulls_last}){
                                ${work_permit_inc_fragment}
                            }
                            work_permit_list_no_expiry_aggregate:work_permit_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_is_null: true}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            work_permit_list_expired_aggregate:work_permit_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_lte: "now()"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            work_permit_list_mon_expiry_aggregate:work_permit_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            work_permit_list_2mon_expiry_aggregate:work_permit_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            work_permit_list_3mon_expiry_aggregate:work_permit_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            work_permit_list_4mon_expiry_aggregate:work_permit_list_aggregate(where: {
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
                    query listAllByEachWorkPermitByLoggedQuery {
                        hr_employees_docs_work_permits(
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
                            notes
                            doc
                            date
                            expiry_date
                            expiry_updated
                            
                            employee{
                                ${employee_personal_details_fragment}
                                work_permit_list(where: {removed: {_eq: ${removed}}}){
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
