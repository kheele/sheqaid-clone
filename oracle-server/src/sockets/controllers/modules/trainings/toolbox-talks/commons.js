
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        training_frequency,
        date,
        subject_list,
        subject_category_list,
        trainer_list,
        job_position_list,
        employee_list,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if(id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        //
        if (training_frequency) {
            filter.push(`training_frequency: {_eq: "${training_frequency}"}`);
        }
        if (date) {
            filter.push(`toolbox_talk_list{date: {_eq: ${date}}}`);
        }
        if (subject_list) {
            filter.push(`subject_id: {_in: ${subject_list}}`);
        }
        if (subject_category_list) {
            filter.push(`subject_category: {_in: ${subject_category_list.map(v => `"${v}"`)}}`);
        }
        if (trainer_list) {
            filter.push(`toolbox_talk_list{trainer_id: {_in: ${trainer_list}}}`);
        }
        if (job_position_list) {
            filter.push(`toolbox_talk_list{job_position_list{job_position_id: {_in: ${job_position_list}}}}`);
        }
        if (employee_list) {
            filter.push(`toolbox_talk_list{register_list{employee_id: {_in: ${employee_list}}}}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="training_toolbox_talks_details_fragment">
exports.training_toolbox_talks_details_fragment = `
  id
  training_frequency
  subject{
    id
    name
  }
  subject_category
  toolbox_talk_list{
    id
    date
    time_from
    time_to
    doc
    attendance_register_doc
    institution_conducting_training
    toolbox_talk{
        id
    }
    trainer{
        id
        fname
        lname
        full_name
        email
        phone
        job_position{
            id
            name
        }
    }
    job_position_list{
        id
        job_position{
            id
            name
        }
    }
    register_list{
        id
        date
        signature
        toolbox_talk_list{
            id
        }
        employee{
            id
            fname
            lname
            full_name
            email
            phone
            job_position{
                id
                name
            }
        }
    }
  }
`;
//</editor-fold>
