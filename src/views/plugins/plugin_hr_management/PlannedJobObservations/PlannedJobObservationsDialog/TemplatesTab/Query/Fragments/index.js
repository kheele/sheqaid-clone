
//<editor-fold desc="job_observation_template_question_list_fragment">
const job_observation_template_question_list_fragment = (deep = 3) => {
  if(deep === 0) {
     return `id`;
  }
  return `
    id
    answer
    responseAttachment
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
    score
    questionnaire{
        id
    }
    idx
    is_page_title
    question_list:question_list{
        ${job_observation_template_question_list_fragment(deep - 1)}
    }
    options{
      optionImage
      optionText
      optionType
    }
    message_list{
        ques{
            id
        }
        msg
        read
        date
        sender{
            id
            fname
            lname
            username
            phone
        }
        recipient{
            id
            fname
            lname
            username
            phone
        }
        contractor_sender{
            id
            fname
            lname
            username
            phone
        }
        contractor_recipient{
            id
            fname
            lname
            username
            phone
        }
        logged_user{
            id
            fname
            lname
            username
            phone
        }
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

//<editor-fold desc="job_observation_template_details_fragment">
export const job_observation_template_details_fragment = `
    id
    created_at
    name
    desc
    status
    status_answered_by_sender
    answered_by
    is_template
    visibility
    job_position{
      id
      name
    }
    template_questionnaire_list_aggregate{
      aggregate{
        count
      }
    }
    page_title_list:question_list(where: {is_page_title: {_eq: true}}){
        ${job_observation_template_question_list_fragment(3)}
    }
    question_list:question_list(where: {is_page_title: {_eq: false}}){
        ${job_observation_template_question_list_fragment(3)}
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
