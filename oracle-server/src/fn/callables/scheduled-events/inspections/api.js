//<editor-fold desc="inspection_question_list_fragment">
const inspection_question_list_fragment = (deep = 3) => {
    if (deep === 0) {
        return `id`;
    }
    return `
    id
    answer
    answer_employee_id  
    answer_asset_id  
    responseAttachment
    hasResponseAttachment
    responseAttachmentRequired
    expiry
    hasExpiry
    isMandatory
    isMultiAnswer
    #open
    link_doc_id
    maxScore
    notify
    notifyAction
    questionImage
    questionText
    questionType
    score
    #questionnaire_id
    #idx
    is_page_title
    question_list{
        ${inspection_question_list_fragment(deep - 1)}
    }
    options{
      optionImage
      optionText
      optionType
      #answer
    }
    notified_list{
        employee_id
        #question_id
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
const inspection_details_fragment = `
    id
    ques_next_id
    ques_prev_id
    #created_at
    name
    desc
    status
    status_answered_by_sender
    answered_by
    #is_template
    visibility
    
    interval
    start_date
    time        
    schedule_date
    #
    asset_type
    asset_id
    template_id
    responsible_person_id
    responsible_department_id
    
    question_list{
        ${inspection_question_list_fragment(3)}
    }
    contractor_site_id
    contractor_client_id
    contractor_id
    company_id        
    client_id        
    project_id        
    site_id   
`;
//</editor-fold>

//<editor-fold desc="query">
const query = `
query onScheduleNextDateQuery($schedule_date: date) {
  default_contractor_questionnaires_connection(
    where: {
	  removed: {_eq: false}, 
      is_template: {_eq: false},
      group: {_eq: "Inspections"},
      ques_next_id: {_is_null: true},
      _or: [
        {schedule_date: {_eq: $schedule_date}},
        {schedule_date: {_is_null: true}}
      ]
    }
  ){
    edges{
      node{
        ${inspection_details_fragment}
      }
    }
  }
}
`;
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="onScheduleNextDate">
exports.onScheduleNextDate = async (data) => {
    // await authorize();

    const list = await listRelay({
        query,
        operationName: "onScheduleNextDateQuery",
        variables: {
            schedule_date: Dates.formatDateSQL(new Date().addDays(-1)),
        },
    });

    if (!list) {
        // res.send();
        return;
    }

    console.log('onScheduleNextDate', list)

    const today = Dates.formatDateSQL(new Date());

    await Promise.all(list.map(async ({id, data}) => {
        let {
            //
            company_id,
            client_id,
            project_id,
            site_id,
            //
            contractor_id,
            contractor_client_id,
            contractor_site_id,
            //
            // status,
            status_answered_by_sender,//
            answered_by,
            // is_template,
            visibility,
            //
            asset_type,
            asset_id,
            //
            responsible_person_id,
            responsible_department_id,
            //
            interval,
            start_date,
            time,
            schedule_date,
            //
            template_id,
            ques_next_id,
            ques_prev_id,
            //
            name,
            desc,
            question_list,
        } = data;

        if (interval === "Daily") {
            if (!schedule_date) {
                schedule_date = today;
            } else {
                schedule_date = today;
            }
        } else if(interval === "Weekly") {

        } else if(interval === "Monthly") {

        } else if(interval === "Quarterly") {

        } else if(interval === "Bi-Annually") {

        } else if(interval === "Annually") {

        }

        question_list = getQuestionnaireTemplateForm(question_list);

        const scheduledItem = await insertInspectionsQuestionnaire({
            company_id,
            client_id,
            project_id,
            site_id,
            //
            contractor_id,
            contractor_client_id,
            contractor_site_id,
            //
            status_answered_by_sender,
            answered_by,
            visibility,
            //
            asset_type,
            asset_id,
            //
            responsible_person_id,
            responsible_department_id,
            interval,
            start_date,
            time,
            //
            schedule_date,
            //
            template_id,
            ques_prev_id: id,
            //
            name,
            desc,
            question_list: {data: question_list},
        });

        if(scheduledItem) {
            return await updateInspectionsQuestionnaire({id, ques_next_id: scheduledItem.id});
        }
    }));
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="insertInspectionsQuestionnaire">
const insertInspectionsQuestionnaire = async (input) => {
    return await insertRelay({
        query: `
            mutation insertInspectionsQuestionnaireMutation($object: default_contractor_questionnaires_insert_input!) {
                insert_default_contractor_questionnaires_one(
                    object: $object
                ) {
                    id
                }
            }
        `,
        operationName: 'insertInspectionsQuestionnaireMutation',
        input: {
            ...input,
            is_template: false,
            group: "Inspections",
            answered_by: "Sender",
        }
    });
};
// </editor-fold>

//<editor-fold desc="updateInspectionsQuestionnaire">
const updateInspectionsQuestionnaire = async (attrs) => {
    const {id} = attrs;
    delete attrs.id;

    return updateMutationImpl({
        mutation: `
            mutation updateInspectionsQuestionnaireMutation($id: default_contractor_questionnaires_pk_columns_input!, $_set: default_contractor_questionnaires_set_input!) {
                update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {
                    id
                }
            }
        `,
        id,
        attrs,
    });
};
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="getQuestionnaireTemplateForm">
const getQuestionnaireTemplateForm = (question_list) => {
    const mapQuestions = (v, n) => {
        delete v.id;
        delete v.open;
        delete v.questionnaire_id;

        if (isArray(v.question_list) && v.question_list.isNotEmpty()) {
            delete v.options;
            delete v.notified_list;
            delete v.message_list;
            delete v.ques_path_list;

            v.question_list = {data: v.question_list.map(mapQuestions)};
        } else {
            delete v.question_list;

            // console.log('questionImage', v.questionImage)
            // if(v.questionImage) {
            //     const {path} = v.questionImage;
            //     v.questionImage = {path: await Utils.toDataURI(path)};
            // }

            // console.log('options', v.options)
            if (isArray(v.options) && v.options.isNotEmpty()) {
                v.options = {
                    data: v.options,
                };
            } else {
                delete v.options;
            }

            // console.log('notified_list', v.notified_list)
            if (isArray(v.notified_list) && v.notified_list.isNotEmpty()) {
                v.notified_list = {
                    data: v.notified_list,
                };
            } else {
                delete v.notified_list;
            }

            // console.log('ques_path_list', v.ques_path_list)
            // if(isArray(v.ques_path_list) && v.ques_path_list.isNotEmpty()) {
            //     v.ques_path_list = {
            //         data: v.ques_path_list,
            //     };
            // } else {
            //     delete v.ques_path_list;
            // }

            v.answer = null;
            v.answer_employee_id = null;
            v.answer_asset_id = null;

            v.score = null;
            v.responseAttachment = null;
        }
        return v;
    };
    return question_list.map(mapQuestions);
}
// </editor-fold>