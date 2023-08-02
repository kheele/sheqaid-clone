
//<editor-fold desc="inspection_question_list_fragment">
export const inspection_question_list_fragment = (deep = 3) => {
  if(deep === 0) {
     return `id`;
  }
  return `
    id
    answer
    responseAttachment
    hasResponseAttachment
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
        ${inspection_question_list_fragment(deep - 1)}
    }
    options{
      optionImage
      optionText
      optionType
      answer
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

//<editor-fold desc="inspection_details_fragment">
export const inspection_details_fragment = `
    id
    created_at
    name
    desc
    status
    status_answered_by_sender
    answered_by
    is_template
    visibility
    
    interval
    start_date
    asset_type
    asset{
      id
      asset_detail{
        asset_type
        name
        reg_num
        serial_num
        manufacturer
        model
        location
        toolkit
        condition
        owning_company
      }
      profile_pic:photo_list(where: {is_default: {_eq: true}}){
          id
          doc    
          is_default
      }
      photo_list{
        id
        is_default
        doc
      }
      responsible_person{
        id
        lname
        fname
        email
        phone
      }
    }
    template{
      id
      name
    }
    responsible_person{
      id
      full_name
    }
    responsible_department{
      id
      name
    }
    
    schedule_list{
      date
      completed
    }
    
    page_title_list:question_list(where: {is_page_title: {_eq: true}}){
        ${inspection_question_list_fragment(3)}
    }
    question_list:question_list(where: {is_page_title: {_eq: false}}){
        ${inspection_question_list_fragment(3)}
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
