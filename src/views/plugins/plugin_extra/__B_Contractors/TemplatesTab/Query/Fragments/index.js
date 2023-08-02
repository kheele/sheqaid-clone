
//<editor-fold desc="contractor_questionnaire_template_details_fragment">
export const contractor_questionnaire_template_details_fragment = `
    id
    created_at
    name
    desc
    category
    doc_version_list{
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

