const {employee_basic_personal_details_fragment, orgs_fragment} = require("../../../../../../graphql/Fragments");

//<editor-fold desc="inc_fragment">
exports.inc_fragment = ({removed, inc_employee = false, }) => `
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
            ${employee_basic_personal_details_fragment}
        }
    }
    issued_by{
        ${employee_basic_personal_details_fragment}
    }
    employee{
        ${inc_employee ? `
            ${employee_basic_personal_details_fragment}
            ${removed !== undefined ? `
                warning_list(where: {removed: {_eq: ${removed}}}){
                    id
                    expiry_date
                }` : ``
            }
        ` : `
            id
        `}
    }
    ${orgs_fragment}
`;
//</editor-fold>
