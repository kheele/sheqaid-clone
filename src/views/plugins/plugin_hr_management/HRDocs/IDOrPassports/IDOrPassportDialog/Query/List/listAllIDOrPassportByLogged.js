import GQLClient from "graphql/GQLClient";
import {employee_personal_details_fragment, orgs_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../../../../../Query/Utils";

//<editor-fold desc="doc_inc_fragment">
const doc_inc_fragment = `
    id
    created_at
    expiry_date
    type
    desc
    doc
    is_default
    removed
    employee{
        id
        ${orgs_fragment}
    }
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
    desc,
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
    //
    department_id,
    job_position_id,
    team_id,
    supervisor_id,
    employee_id,
    //
    desc,
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
        query listAllByGroupIDOrPassportByLoggedQuery {
          hr_employees(
            where: {
              document_list_aggregate: {
                count: {
                  predicate: {_gt: 0},
                  filter: {removed: {_eq: ${removed}}, type: {_eq: "ID/Passport"}${filter}}
                }
              }, 
              document_list: {removed: {_eq: ${removed}}, type: {_eq: "ID/Passport"}${filter}}
              ${filterEmployee}
            }
            order_by: {lname: asc},
            offset: ${offset},
            ${limit > 0 ? `,limit: ${limit}` : ''}
          ) {
            ${employee_personal_details_fragment}
            id_or_passport_list:document_list(where: {removed: {_eq: ${removed}}, type: {_eq: "ID/Passport"}}, order_by: {expiry_date: desc_nulls_last}){
              ${doc_inc_fragment}
            }
            id_or_passport_list_no_expiry_aggregate:document_list_aggregate(where: {
              removed: {_eq: ${removed}}, expiry_date: {_is_null: true}, type: {_eq: "ID/Passport"}
            }){
              aggregate{
                count
              }
            }
            id_or_passport_list_expired_aggregate:document_list_aggregate(where: {
              removed: {_eq: ${removed}}, expiry_date: {_lte: "now()"}, type: {_eq: "ID/Passport"}
            }){
              aggregate{
                count
              }
            }
            id_or_passport_list_mon_expiry_aggregate:document_list_aggregate(where: {
              removed: {_eq: ${removed}}, expiry_date: {_gt: "now()", _lte: "${mon}"}, type: {_eq: "ID/Passport"}
            }){
              aggregate{
                count
              }
            }
            id_or_passport_list_2mon_expiry_aggregate:document_list_aggregate(where: {
              removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}, type: {_eq: "ID/Passport"}
            }){
              aggregate{
                count
              }
            }
            id_or_passport_list_3mon_expiry_aggregate:document_list_aggregate(where: {
              removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}, type: {_eq: "ID/Passport"}
            }){
              aggregate{
                count
              }
            }
            id_or_passport_list_4mon_expiry_aggregate:document_list_aggregate(where: {
              removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon3}"}, type: {_eq: "ID/Passport"}
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
        query listAllByEachIDOrPassportByLoggedQuery {
          hr_employees_documents(
            where: {
              removed: {_eq: ${removed}},
              type: {_eq: "ID/Passport"},
              ${filter},
              ${filterEmployee}
            },
            order_by: {employee: {lname: asc}},
            offset: ${offset},
            ${limit > 0 ? `,limit: ${limit}` : ''}
          ) {
            id
            created_at
            removed
            desc
            doc
            type
            is_default
            expiry_date
            
            employee{
              ${employee_personal_details_fragment}
              id_or_passport_list:document_list(where: {removed: {_eq: ${removed}}, type: {_eq: "ID/Passport"}}){
                id
                expiry_date
              }
              ${orgs_fragment}
            }
          }
        }
      `,
    });
    //</editor-fold>
  }
};
