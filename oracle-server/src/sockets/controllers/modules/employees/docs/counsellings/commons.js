const {employee_basic_personal_details_fragment, orgs_fragment} = require("../../../../../../graphql/Fragments");

// //<editor-fold desc="getVariablesAndQueryConfig">
// exports.getVariablesAndQueryConfig = (
//     {
//         orgs_filter = [],
//         //
//         site_id, project_id, client_id,
//         //
//         exact_orgs = false,
//     }
// ) => {
//     //<editor-fold desc="variables, filters">
//     let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
//
//     filter = filter.map(v => `{${v}}`).join(',');
//     //</editor-fold>
//
//     return {filter};
// };
// //</editor-fold>

//<editor-fold desc="inc_fragment">
exports.inc_fragment = ({removed, inc_employee = false, }) => `
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
       ${employee_basic_personal_details_fragment}
    }      
    employee{
        ${inc_employee ? `
            ${employee_basic_personal_details_fragment}
            ${removed !== undefined ? `
                counselling_list(where: {removed: {_eq: ${removed}}}){
                    id
                    expiry_date
                }` : ``
}
        ` : `
            id
        `}
    }
    witness_list{
        id
        witness{
            ${employee_basic_personal_details_fragment}
       }
    }
    ${orgs_fragment}
`;
//</editor-fold>
