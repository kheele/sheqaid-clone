
export const getVariablesAndQueryConfig = (
    {
        org_id: {key, value},
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        date,
    }
) => {
    //<editor-fold desc="variables, filters">
    const variables = {
        [key]: value,
    };

    let filter = [];
    if (job_position_id) {
        filter.push(`job_position_id: {_eq: ${job_position_id}}`);
    }
    if(trainer_id) {
        filter.push(`trainer_id: {_eq: ${trainer_id}}`);
    }
    if(course_id) {
        filter.push(`course_id: {_eq: ${course_id}}`);
    }
    if(unit_standard) {
        filter.push(`unit_standard: {_eq: ${unit_standard}}`);
    }
    if(date) {
        filter.push(`date: {_eq: ${date}}`);
    }

    filter = filter.join(',');
    //</editor-fold>

    return {variables, filter};
};