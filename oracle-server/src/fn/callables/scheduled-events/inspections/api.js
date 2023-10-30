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
      company_id: {_eq: 18},
      
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

    // console.log('onScheduleNextDate', list)

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

        //start_date

        const create_schedule_date = ({interval, schedule_date}) => {
            if (schedule_date) {
                schedule_date = Dates.parse(schedule_date);
            }

            if (interval === "Daily") {
                if (schedule_date) {
                    return Dates.formatDateSQL(schedule_date.addDays(1));
                } else {
                    const lastDate = Dates.getWeeksStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
                    console.log('lastDate', interval, lastDate)//
                    if(lastDate) {
                        const days = lastDate.durationNextDays(new Date());
                        console.log('lastDate', interval, lastDate, days)
                        if (days === 0) {
                            return Dates.formatDateSQL(lastDate);
                        }
                        return Dates.formatDateSQL(lastDate.addDays(1));
                    }
                    return Dates.formatDateSQL(start_date);
                }
            } else if (interval === "Weekly") {
                if (schedule_date) {
                    let days = schedule_date.durationNextDays(new Date());
                    if (days === 7) {
                        return Dates.formatDateSQL(schedule_date.addWeeks(1));
                    }
                    const lastDate = Dates.getWeeksStartAndEndDateRange(schedule_date, new Date()).map(({currDate}) => currDate).pop();
                    console.log('lastDate', interval, lastDate)

                    if (!lastDate) return;

                    days = lastDate.durationNextDays(new Date());
                    console.log('lastDate', interval, lastDate, days)
                    if (days === 0) {
                        return Dates.formatDateSQL(lastDate);
                    }
                    // return Dates.formatDateSQL(lastDate.addWeeks(1));
                    return Dates.formatDateSQL(lastDate.addDays(7));
                } else {
                    const lastDate = Dates.getWeeksStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
                    // return Dates.formatDateSQL(lastDate.addWeeks(1));
                    return lastDate && Dates.formatDateSQL(lastDate.addDays(7));
                }
            } else if (interval === "Monthly") {
                if (schedule_date) {
                    let months = schedule_date.durationNextMonths(new Date());
                    if (months === 1) {
                        return Dates.formatDateSQL(schedule_date.addMonths(1));
                    }
                    const lastDate = Dates.getMonthsStartAndEndDateRange(schedule_date, new Date()).map(({currDate}) => currDate).pop();
                    console.log('lastDate', interval, lastDate)//

                    if (!lastDate) return;

                    months = lastDate.durationNextMonths(new Date());
                    const days = lastDate.durationNextDays(new Date());
                    console.log('lastDate', interval, lastDate, months, days)
                    if (months === 0) {
                        if (days === 0) {
                            return Dates.formatDateSQL(lastDate);
                        }
                    }
                    return Dates.formatDateSQL(lastDate.addMonths(1));
                } else {
                    const lastDate = Dates.getMonthsStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
                    return lastDate && Dates.formatDateSQL(lastDate.addMonths(1));
                }
            } else if (interval === "Quarterly") {
                if (schedule_date) {
                    let months = schedule_date.durationNextMonths(new Date());
                    if (months === 3) {
                        return Dates.formatDateSQL(schedule_date.addMonths(3));
                    }
                    const lastDate = Dates.getQuartersStartAndEndDateRange(schedule_date, new Date()).map(({currDate}) => currDate).pop();
                    console.log('lastDate', interval, lastDate)//

                    if (!lastDate) return;

                    months = lastDate.durationNextMonths(new Date());
                    const days = lastDate.durationNextDays(new Date());
                    console.log('lastDate', interval, lastDate, months, days)
                    if (months === 0) {
                        if (days === 0) {
                            return Dates.formatDateSQL(lastDate);
                        }
                    }
                    return Dates.formatDateSQL(lastDate.addMonths(3));
                } else {
                    const lastDate = Dates.getQuartersStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
                    return lastDate && Dates.formatDateSQL(lastDate.addMonths(3));
                }
            } else if (interval === "Bi-Annually") {
                if (schedule_date) {
                    let months = schedule_date.durationNextMonths(new Date());
                    if (months === 6) {
                        return Dates.formatDateSQL(schedule_date.addMonths(6));
                    }
                    const lastDate = Dates.getHalvesStartAndEndDateRange(schedule_date, new Date()).map(({currDate}) => currDate).pop();
                    console.log('lastDate', interval, lastDate)

                    if (!lastDate) return;

                    months = lastDate.durationNextMonths(new Date());
                    const days = lastDate.durationNextDays(new Date());
                    console.log('lastDate', interval, lastDate, months, days)
                    if (months === 0) {
                        if (days === 0) {
                            return Dates.formatDateSQL(lastDate);
                        }
                    }
                    return Dates.formatDateSQL(lastDate.addMonths(6));
                } else {
                    const lastDate = Dates.getHalvesStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
                    return lastDate && Dates.formatDateSQL(lastDate.addMonths(6));
                }
            } else if (interval === "Annually") {
                if (schedule_date) {
                    let years = schedule_date.durationNextYears(new Date());
                    if (years === 1) {
                        return Dates.formatDateSQL(schedule_date.addYears(1));
                    }
                    const lastDate = Dates.getYearsStartAndEndDateRange(schedule_date, new Date()).map(({currDate}) => currDate).pop();
                    console.log('lastDate', interval, lastDate)

                    if (!lastDate) return;

                    years = lastDate.durationNextYears(new Date());
                    const days = lastDate.durationNextDays(new Date());
                    console.log('lastDate', interval, lastDate, years, days)
                    if (years === 0) {
                        if (days === 0) {
                            return Dates.formatDateSQL(lastDate);
                        }
                    }
                    return Dates.formatDateSQL(lastDate.addYears(1));
                } else {
                    const lastDate = Dates.getYearsStartAndEndDateRange(start_date, new Date()).map(({currDate}) => currDate).pop();
                    return lastDate && Dates.formatDateSQL(lastDate.addYears(1));
                }
            }
        };

        schedule_date = create_schedule_date({interval, schedule_date});

        if(!schedule_date) {
            return;
        }

        question_list = getQuestionnaireTemplateForm(question_list);

        const save = async (input) => {
            // console.log('input', input);

            const scheduledItem = await insertInspectionsQuestionnaire(input);
            console.log('scheduledItem', scheduledItem);
            if (scheduledItem) {
                return updateInspectionsQuestionnaire({id: input.ques_prev_id, ques_next_id: scheduledItem.id}).
                then(_ => scheduledItem);
            }
        };

        const input = {
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
            //
            name,
            desc,
            question_list: {data: question_list},
        };

        const savedItem = await save({...input, ques_prev_id: id});

        if(savedItem){
            schedule_date = create_schedule_date({interval, schedule_date});
            if (schedule_date) {
                await save({...input, ques_prev_id: savedItem.id, schedule_date});
            }
        }
    }));
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="insertInspectionsQuestionnaire">
const insertInspectionsQuestionnaire = async (input) => {
    return await insertGraphQL({
        mutation: `
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

    return updateGraphQL({
        mutation: `
            mutation updateInspectionsQuestionnaireMutation($id: default_contractor_questionnaires_pk_columns_input!, $_set: default_contractor_questionnaires_set_input!) {
                update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {
                    id
                }
            }
        `,
        operationName: 'updateInspectionsQuestionnaireMutation',
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