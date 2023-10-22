
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    filter = filter.map(v => `{${v}}`).join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="inspection_template_question_list_fragment">
const inspection_template_question_list_fragment = (deep = 3) => {
    if(deep === 0) {
        return `id`;
    }
    return `
    id
    hasResponseAttachment
    responseAttachmentRequired
    expiry
    hasExpiry
    isMandatory
    isMultiAnswer
    open
    linkDoc {
        id
        created_at
        name
        desc
        category
    }
    maxScore
    notify
    notifyAction
    questionImage
    questionText
    questionType
    questionnaire{
        id
    }
    idx
    is_page_title
    question_list:question_list{
        ${inspection_template_question_list_fragment(deep - 1)}
    }
    options{
      optionImage
      optionText
      optionType
    }
    notified_list{
        employee{
            id
            fname
            lname
            email
            phone
        }
        ques{
            id
        }
    }
    #ques_path_list{
    #    id
    #    path
    #    ques{
    #        id
    #    }
    #}
`;
};
//</editor-fold>

//<editor-fold desc="inspection_template_details_fragment">
exports.inspection_template_details_fragment = `
    id
    created_at
    name
    desc
    status
    status_answered_by_sender
    answered_by
    is_template
    visibility
    template_questionnaire_list_aggregate{
      aggregate{
        count
      }
    }
    page_title_list:question_list(where: {is_page_title: {_eq: true}}){
        ${inspection_template_question_list_fragment(3)}
    }
    question_list:question_list(where: {is_page_title: {_eq: false}}){
        ${inspection_template_question_list_fragment(3)}
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
