
export const getVariablesAndQueryConfig = (
    {
        org_id: {key, value},
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        provider_requirement,
        requirement,
        status,
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
    if(provider_requirement) {
        filter.push(`provider_requirement: {_eq: ${provider_requirement}}`);
    }
    if(requirement) {
        filter.push(`requirement: {_eq: ${requirement}}`);
    }
    if(status) {
        filter.push(`status: {_eq: ${status}}`);
    }

    filter = filter.join(',');
    //</editor-fold>

    return {variables, filter};
};