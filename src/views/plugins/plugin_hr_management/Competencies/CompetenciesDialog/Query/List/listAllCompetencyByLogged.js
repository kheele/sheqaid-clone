import GQLClient from "graphql/GQLClient";
import {orgs_fragment, employee_personal_details_fragment} from "../../../../Query/Fragments";
import {getVariablesAndQueryConfig} from "../../../../Query/Utils";

//<editor-fold desc="competency_inc_fragment">
const competency_inc_fragment = `
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
    removed = false,
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
    //
    department_id,
    job_position_id,
    team_id,
    supervisor_id,
    employee_id,
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
                    query listAllByGroupCompetencyByLoggedQuery {
                        hr_employees(
                            where: {
                                competency_list_aggregate: {count: {predicate: {_gt: 0}}}, 
                                competency_list: {removed: {_eq: ${removed}}${filter}}
                                ${filterEmployee}
                            },
                            order_by: {lname: asc},
                            offset: ${offset},
                            ${limit > 0 ? `,limit: ${limit}` : ''}
                        ) {
                            ${employee_personal_details_fragment}
                            competency_list(where: {removed: {_eq: ${removed}}}, order_by: {expiry_date: desc_nulls_last}){
                                ${competency_inc_fragment}
                            }
                            competency_list_no_expiry_aggregate:competency_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_is_null: true}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            competency_list_expired_aggregate:competency_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_lte: "now()"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            competency_list_mon_expiry_aggregate:competency_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            competency_list_2mon_expiry_aggregate:competency_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            competency_list_3mon_expiry_aggregate:competency_list_aggregate(where: {
                                removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            competency_list_4mon_expiry_aggregate:competency_list_aggregate(where: {
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
                    query listAllByEachCompetencyByLoggedQuery {
                        hr_employees_docs_competencies(
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
                            accreditation_num
                            competency_type
                            type
                            doc
                            issued_date
                            expiry_date
                            expiry_updated
                            training{
                                id
                                course{
                                    id
                                    name
                                }
                            }
                            employee{
                                ${employee_personal_details_fragment}
                                competency_list(where: {removed: {_eq: ${removed}}}){
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
