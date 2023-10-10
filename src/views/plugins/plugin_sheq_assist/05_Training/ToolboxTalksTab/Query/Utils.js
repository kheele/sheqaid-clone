
export const getVariablesAndQueryConfig = (
    {
        org_id: {key, value},
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
    }
) => {
    //<editor-fold desc="variables, filters">
    const variables = {
        [key]: value,
    };

    let filter = [];
    if(name) {
        filter.push(`name: {_eq: ${name}}`);
    }
    if(unit_standard) {
        filter.push(`unit_standard: {_eq: ${unit_standard}}`);
    }
    if(frequency) {
        filter.push(`frequency: {_eq: ${frequency}}`);
    }
    if(provider) {
        filter.push(`provider: {_eq: ${provider}}`);
    }
    if (job_position_id) {
        filter.push(`job_position_id: {_eq: ${job_position_id}}`);
    }
    if (sector_id) {
        filter.push(`sector_id: {_eq: ${sector_id}}`);
    }

    filter = filter.join(',');
    //</editor-fold>

    return {variables, filter};
};