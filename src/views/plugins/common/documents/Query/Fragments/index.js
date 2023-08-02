import {employee_personal_details_fragment} from "graphql/Fragments";

//<editor-fold desc="document_details_fragment">
export const document_details_fragment = `
    id
    created_at
    title
    desc
    doc_type
    internal_or_external
    doc_version_list(order_by:{expiry: desc_nulls_last}){
        id
        type
        doc_num
        doc
        expiry
    }
    latest_version: doc_version_list(order_by: {expiry: desc_nulls_last}){
        id
        type
        doc_num
        doc
        expiry
    }
    shared_doc_list{
        id
        doc_expiry_date
        email
        fname
        lname
    }
    employee{
        ${employee_personal_details_fragment}
    }
    responsible_person{
        ${employee_personal_details_fragment}
    }
    responsible_department{
        id
        name
    }
    contractor_site{
        id
        name
    }
    contractor {
        id
        name
    }
`;
//</editor-fold>

