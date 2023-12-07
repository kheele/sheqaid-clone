const {employee_basic_personal_details_fragment, orgs_fragment, personal_details_other_fragment} = require("../../../../../../graphql/Fragments");

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
        witness_external{
            ${personal_details_other_fragment}
        }
    }
    ${orgs_fragment}
`;
//</editor-fold>
