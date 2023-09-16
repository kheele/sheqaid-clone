import GQLClient from "graphql/GQLClient";
import {employee_personal_details_fragment, orgs_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../../../../Query/Utils";

//<editor-fold desc="counselling_inc_fragment">
const counselling_inc_fragment = `
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
       ${employee_personal_details_fragment}
    }      
    employee{
        id
    }
    witness_list{
        id
        witness{
            ${employee_personal_details_fragment}
       }
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
    responsible_person,
    types,
    reasons,
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
    responsible_person,
    types,
    reasons,
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
                    query listAllByGroupCounsellingByLoggedQuery {
                        hr_employees(
                            where: {
                                counselling_list_aggregate: {count: {predicate: {_gt: 0}}}, 
                                counselling_list: {removed: {_eq: ${removed}}${filter}}
                                ${filterEmployee}
                            }
                            order_by: {lname: asc},
                            offset: ${offset},
                            ${limit > 0 ? `,limit: ${limit}` : ''}
                        ) {
                            ${employee_personal_details_fragment}
                            counselling_list(where: {removed: {_eq: ${removed}}}, order_by: {expiry_date: desc_nulls_last}){
                                ${counselling_inc_fragment}
                            }
                            counselling_list_no_expiry_aggregate:counselling_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_is_null: true}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            counselling_list_expired_aggregate:counselling_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_lte: "now()"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            counselling_list_mon_expiry_aggregate:counselling_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            counselling_list_2mon_expiry_aggregate:counselling_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            counselling_list_3mon_expiry_aggregate:counselling_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            counselling_list_4mon_expiry_aggregate:counselling_list_aggregate(where: {
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
                    query listAllByEachCounsellingByLoggedQuery {
                        hr_employees_docs_counsellings(
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
                            corrective_actions
                            counselling_hrs_to_complete
                            expiry_date
                            expiry_updated
                            removed
                            incident_desc
                            reasons
                            types
                            responsible_person{
                                ${employee_personal_details_fragment}
                            }
                            employee{
                                ${employee_personal_details_fragment}
                                counselling_list(where: {removed: {_eq: ${removed}}}){
                                    id
                                    expiry_date
                                }
                            }
                            witness_list{
                                id
                                witness{
                                    ${employee_personal_details_fragment}
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
