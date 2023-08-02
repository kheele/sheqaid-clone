import GQLClient from "graphql/GQLClient";
import {orgs_fragment, employee_personal_details_fragment} from "views/plugins/plugin_hr_management/Query/Fragments";
import {getVariablesAndQueryConfig} from "views/plugins/plugin_hr_management/Query/Utils";

//<editor-fold desc="job_appointment_inc_fragment">
const job_appointment_inc_fragment = `
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
        view = 'Employee',
        mon, mon2, mon3,
        expiry_date = 'ALL',
        removed = false,
        org_id, org_id: {key, value},
    }
) => {
    const {variables, filter} = getVariablesAndQueryConfig({
        mon, mon2, mon3,
        expiry_date,
        removed,
        org_id,
    });

    if (view === 'Employee') {
        //<editor-fold desc="ByGroup">
        return GQLClient
            .query({
                variables,
                query: `
                    query listAllByGroupJobAppointmentByLoggedClientQuery(
                        $removed: Boolean, 
                        $${key}: bigint
                    ) {
                        hr_employees(where: {
                            ${key}: {_eq: $${key}}, 
                            job_appointment_list_aggregate: {count: {predicate: {_gt: 0}}}, 
                            job_appointment_list: {removed: {_eq: $removed}${filter}}
                        }) {
                            ${employee_personal_details_fragment}
                            job_appointment_list(where: {removed: {_eq: $removed}}, order_by: {expiry_date: desc_nulls_last}){
                                ${job_appointment_inc_fragment}
                            }
                            job_appointment_list_no_expiry_aggregate:job_appointment_list_aggregate(where: {
                                removed: {_eq: $removed}, expiry_date: {_is_null: true}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            job_appointment_list_expired_aggregate:job_appointment_list_aggregate(where: {
                                removed: {_eq: $removed}, expiry_date: {_lte: "now()"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            job_appointment_list_mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                                removed: {_eq: $removed}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            job_appointment_list_2mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                                removed: {_eq: $removed}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            job_appointment_list_3mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                                removed: {_eq: $removed}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                            }){
                                aggregate{
                                    count
                                }
                            }
                            job_appointment_list_4mon_expiry_aggregate:job_appointment_list_aggregate(where: {
                                removed: {_eq: $removed}, expiry_date: {_gt: "${mon3}"}
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
                variables,
                query: `
                    query listAllByEachJobAppointmentByLoggedClientQuery(
                        $removed: Boolean, 
                        $${key}: bigint
                    ) {
                        hr_employees_docs_job_appointments(where: {
                            removed: {_eq: $removed}, 
                            ${key}: {_eq: $${key}}
                            ${filter}
                        }) {
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
                                job_appointment_list(where: {removed: {_eq: $removed}}){
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